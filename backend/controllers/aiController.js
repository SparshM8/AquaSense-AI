import axios from "axios";
import WaterRecord from "../models/WaterRecord.js";
import LeakageAlert from "../models/LeakageAlert.js";

export const getPredictions = async (req, res) => {
  try {
    const records = await WaterRecord.find({
      userId: req.user._id,
    })
      .sort({ date: 1 })
      .limit(90);

    if (records.length < 5) {
      return res.status(400).json({
        message: "Need at least 5 records for prediction",
      });
    }

    const data = records.map((r) => ({
      date: r.date,
      liters: r.liters,
    }));

    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/predict`,
      { data }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      message: "AI service error: " + err.message,
    });
  }
};

export const getAnomalies = async (req, res) => {
  try {
    const records = await WaterRecord.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    if (records.length === 0) {
      return res.json({
        anomalies: [],
        anomalyCount: 0,
        totalAnalyzed: 0,
      });
    }

    const avg =
      records.reduce(
        (sum, r) => sum + Number(r.liters),
        0
      ) / records.length;

    const anomalies = [];

    for (const r of records) {
      const deviation = Math.round(
        ((r.liters - avg) / avg) * 100
      );

      if (r.liters > avg * 1.3) {
        const severity =
          r.liters > avg * 1.7
            ? "high"
            : "medium";

        anomalies.push({
          id: r._id,
          date: new Date(r.date).toLocaleDateString(),
          liters: r.liters,
          location: r.location,
          deviation,
          severity,
          anomalyScore: (
            r.liters / avg
          ).toFixed(2),
        });

        await WaterRecord.findByIdAndUpdate(
          r._id,
          {
            isAnomaly: true,
          }
        );

        await LeakageAlert.findOneAndUpdate(
          {
            userId: req.user._id,
            location: r.location,
          },
          {
            userId: req.user._id,
            severity,
            message: `Anomaly detected at ${r.location}`,
            location: r.location,
            deviation,
          },
          {
            upsert: true,
            new: true,
          }
        );
      }
    }

    return res.json({
      anomalies,
      anomalyCount: anomalies.length,
      totalAnalyzed: records.length,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const records = await WaterRecord.find({
      userId: req.user._id,
    })
      .sort({ date: -1 })
      .limit(30);

    const alerts = await LeakageAlert.find({
      userId: req.user._id,
      resolved: false,
    });

    const liters = records.map((r) => r.liters);

    const avg =
      liters.reduce((a, b) => a + b, 0) /
      (liters.length || 1);

    const recs = [];

    if (
      alerts.filter((a) => a.severity === "high").length > 0
    ) {
      recs.push({
        icon: "tool",
        priority: "high",
        title: "Fix high-risk pipe leakages immediately",
      });
    }

    if (avg > 3500) {
      recs.push({
        icon: "trending-down",
        priority: "high",
        title: "Reduce excessive usage",
      });
    }

    res.json({
      recommendations: recs,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
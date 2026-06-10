import WaterRecord from "../models/WaterRecord.js";
import csv from "csv-parser";
import fs from "fs";

export const getRecords = async (req, res) => {
  try {

    const records = await WaterRecord.find()
      .sort({ date: -1 })

    res.json({
      records,
      total: records.length,
      pages: 1
    })

  } catch (err) {

    res.status(500).json({
      message: err.message
    })

  }
}

export const createRecord = async (req, res) => {
  try {
    const record = await WaterRecord.create({
      ...req.body,
      userId: req.user?._id,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const record = await WaterRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!record) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.json(record);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await WaterRecord.findByIdAndDelete(
      req.params.id
    );

    if (!record) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const importCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        console.log("CSV ROW:", row);

        const date = row.Date || row.date;
        const liters =
          row.Water_Used || row.liters;

        if (date && liters) {
          results.push({
            userId: req.user?._id || null,
            date: new Date(date),
            liters: Number(liters),
            location:
              row.Place ||
              row.location ||
              "Unknown",
            department:
              row.department ||
              "General",
            notes:
              row.Remarks ||
              row.notes ||
              "",
          });
        }
      })
      .on("end", async () => {
        try {
          if (results.length === 0) {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
              message:
                "No valid records found in CSV",
            });
          }

          const inserted =
            await WaterRecord.insertMany(results);

          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: `Imported ${inserted.length} records`,
          });
        } catch (err) {
          console.error(err);

          res.status(500).json({
            message: err.message,
          });
        }
      });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const records = await WaterRecord.find().sort({ date: 1 });

    if (!records.length) {
      return res.json({
        today: 0,
        weekly: 0,
        monthly: 0,
        average: 0,
        peak: 0,
        lowest: 0,
        sustainabilityScore: 0,
        trend: []
      });
    }

    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const todayRecords = records.filter(
      r => new Date(r.date) >= todayStart
    );

    const weekRecords = records.filter(
      r => new Date(r.date) >= weekStart
    );

    const monthRecords = records.filter(
      r => new Date(r.date) >= monthStart
    );

    const sum = arr =>
      arr.reduce(
        (total, r) => total + Number(r.liters || 0),
        0
      );

    const totalUsage = sum(records);

    const average = Math.round(
      totalUsage / records.length
    );

    const peak = Math.max(
      ...records.map(r => Number(r.liters))
    );

    const lowest = Math.min(
      ...records.map(r => Number(r.liters))
    );

    const trend = records.map(r => ({
      date: r.date,
      liters: r.liters
    }));

    res.json({
      today: sum(todayRecords),
      weekly: sum(weekRecords),
      monthly: sum(monthRecords),
      average,
      peak,
      lowest,
      sustainabilityScore: 85,
      trend
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
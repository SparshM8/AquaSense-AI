import User from "../models/User.js";
import WaterRecord from "../models/WaterRecord.js";
import LeakageAlert from "../models/LeakageAlert.js";

export const getUsers = async (req, res) => {
  console.log("GET USERS HIT");
  console.log(req.user);

  try {
    const users = await User.find()
      .select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalRecords, totalAlerts] =
      await Promise.all([
        User.countDocuments(),
        WaterRecord.countDocuments(),
        LeakageAlert.countDocuments(),
      ]);

    const allRecords = await WaterRecord.find();

    const totalLiters = allRecords.reduce(
      (sum, r) => sum + Number(r.liters),
      0
    );

    const monthlyAgg =
      await WaterRecord.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            total: {
              $sum: "$liters",
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    res.json({
      totalUsers,
      totalRecords,
      totalAlerts,
      totalLiters,
      monthlyAgg,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
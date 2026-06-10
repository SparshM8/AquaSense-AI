import mongoose from "mongoose";

const leakageAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    deviation: {
      type: Number,
      default: 0,
    },

    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const LeakageAlert = mongoose.model(
  "LeakageAlert",
  leakageAlertSchema
);

export default LeakageAlert;
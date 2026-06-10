import mongoose from "mongoose";

const waterRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    liters: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      default: "General",
    },

    notes: {
      type: String,
      default: "",
    },

    isAnomaly: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

waterRecordSchema.index({
  userId: 1,
  date: -1,
});

const WaterRecord = mongoose.model(
  "WaterRecord",
  waterRecordSchema
);

export default WaterRecord;
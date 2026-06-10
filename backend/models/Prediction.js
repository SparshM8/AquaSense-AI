const mongoose = require('mongoose');
const predictionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nextDay:   Number,
  nextWeek:  Number,
  nextMonth: Number,
  forecast:  [{ date: String, predicted: Number }],
  generatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Prediction', predictionSchema);

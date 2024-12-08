const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FitbitDataSchema = new Schema({
  userId: { type: String, required: true },
  steps: { type: Number, default: 0 }, 
  heartRate: { type: Number, default: 0 },   
  sleepDuration: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }    
});

module.exports = mongoose.model('FitbitData', FitbitDataSchema);
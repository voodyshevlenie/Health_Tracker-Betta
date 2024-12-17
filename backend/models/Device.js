const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  macAddress: {
    type: String,
    required: true,
    unique: true,
  },
  lastSyncTime: {
    type: Date,
  },
  data: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      steps: Number,
      heartRate: Number,
      caloriesBurned: Number,
    },
  ],
});

module.exports = mongoose.model('Device', deviceSchema);
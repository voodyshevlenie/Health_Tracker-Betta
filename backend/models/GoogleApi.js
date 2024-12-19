const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
    userId: String,
    date: Date,
    steps: Number,
    deviceId: String
});

const HealthData = mongoose.model('HealthData', healthSchema);

module.exports.HealthData = HealthData;
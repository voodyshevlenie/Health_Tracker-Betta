const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceType: {
        type: String,
        enum: ['fitbit', 'apple', 'xiaomi'],
        required: true
    },
    steps: {
        type: Number
    },
    heartRate: {
        type: Number
    },
    sleepDuration: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Device', deviceSchema);
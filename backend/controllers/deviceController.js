const Device = require('../models/Device');

exports.getDeviceDataByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const devices = await Device.find({ userId }).sort({ date: -1 });
        
        if (!devices) {
            return res.status(404).json({ message: 'No device data found for this user.' });
        }

        return res.status(200).json(devices);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.createDeviceData = async (req, res) => {
    try {
        const { userId, deviceType, steps, heartRate, sleepDuration } = req.body;

        const newDevice = new Device({
            userId,
            deviceType,
            steps,
            heartRate,
            sleepDuration
        });

        await newDevice.save();

        return res.status(201).json(newDevice);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
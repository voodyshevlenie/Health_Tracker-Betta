const { google } = require('googleapis');
const mongoose = require('mongoose');

const HealthData = require('../models/GoogleApi').HealthData;

module.exports = {
    getDevices: async (req, res) => {
        try {
            const fitness = google.fitness({ version: 'v1', auth: req.oauth2Client });
            const response = await fitness.users.dataSources.list({
                userId: 'me'
            });

            const devices = response.data.dataSource.map(device => ({
                id: device.dataStreamId,
                name: device.device?.name || 'Unknown Device',
                type: device.type
            }));

            res.json(devices);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching devices from Google Fit.', error: error.message });
        }
    },

    getDeviceData: async (req, res) => {
        const { deviceId } = req.params;
        const today = new Date();
        const endTimeMillis = today.getTime();
        const startTimeMillis = endTimeMillis - 24 * 60 * 60 * 1000; // 24 часа назад

        try {
            const fitness = google.fitness({ version: 'v1', auth: req.oauth2Client });
            const response = await fitness.users.dataSources.datasets.get({
                userId: 'me',
                dataSourceId: deviceId,
                datasetId: `${startTimeMillis}-${endTimeMillis}`
            });

            const stepsData = response.data.point;
            let totalSteps = 0;
            for (const point of stepsData) {
                totalSteps += parseInt(point.value[0].intVal);
            }

            res.json({ totalSteps });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching device data from Google Fit.', error: error.message });
        }
    },

    saveDeviceData: async (req, res) => {
        const { userId, date, steps, deviceId } = req.body;

        const healthData = new HealthData({
            userId,
            date,
            steps,
            deviceId
        });

        try {
            await healthData.save();
            res.json({ message: 'Device data saved successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error saving device data to database.', error: error.message });
        }
    },

    sendBluetoothData: async (req, res) => {
        const { deviceId } = req.body;

        const fitness = google.fitness({ version: 'v1', auth: req.oauth2Client });
        const response = await fitness.users.dataSources.datasets.get({
            userId: 'me',
            dataSourceId: deviceId,
            datasetId: `${startTimeMillis}-${endTimeMillis}`
        });

        const stepsData = response.data.point;
        let totalSteps = 0;
        for (const point of stepsData) {
            totalSteps += parseInt(point.value[0].intVal);
        }

        const healthData = new HealthData({
            userId: 'me',
            date: new Date(),
            steps: totalSteps,
            deviceId
        });

        try {
            await healthData.save();
            res.json({ message: 'Данные с устройства успешно получены и сохранены.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка при сохранении данных.', error: error.message });
        }
    }
};
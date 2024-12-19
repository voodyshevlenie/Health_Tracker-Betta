const express = require('express');
const controller = require('../controllers/googleapiController');

const router = express.Router();

router.get('/devices', controller.getDevices);
router.get('/device-data/:deviceId', controller.getDeviceData);
router.post('/save-device-data', controller.saveDeviceData);
router.post('/send-bluetooth-data', controller.sendBluetoothData);

module.exports = router;
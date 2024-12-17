const express = require('express');
const router = express.Router();
const { addDevice, getDevices, getDeviceByMacAddress, updateDeviceData } = require('../controllers/deviceController');

router.post('/', addDevice);
router.get('/', getDevices);
router.get('/:macAddress', getDeviceByMacAddress);
router.put('/:macAddress/data', updateDeviceData);

module.exports = router;
const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/deviceController');

router.get('/:id', deviceController.getDeviceDataByUserId);

router.post('/', deviceController.createDeviceData);

module.exports = router;
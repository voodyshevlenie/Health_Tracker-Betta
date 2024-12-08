const express = require('express');
const router = express.Router();
const FitbitController = require('../controllers/fitbitController');
router.post('/sync', FitbitController.syncData); 

module.exports = router;
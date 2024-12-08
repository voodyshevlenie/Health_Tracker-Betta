const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.get('/', activityController.getAllActivities);

router.post('/create', activityController.createActivity);

router.get('/:id', activityController.getActivityById);

router.put('/update/:id', activityController.updateActivity);

router.delete('/delete/:id', activityController.deleteActivity);

module.exports = router;
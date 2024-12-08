const Activity = require("../models/Activity");
const jwt = require("jsonwebtoken");
const secretKey = "jwtSecret";

exports.getAllActivities = async (req, res) => {
    let userId;
    try {
        jwt.verify(
            req.headers["authorization"].substring(7),
            secretKey,
            (err, decodedToken) => {
                if (err) {
                    console.error("Error decoding token:", err);
                } else {
                    userId = decodedToken.user.id;
                }
            }
        );
        const activities = await Activity.find({ userId: userId });
        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.createActivity = async (req, res) => {
    try {
        let activity = {};
        const { activityName, duration, caloriesBurned, steps, distance, date } =
            req.body;
        if (
            req.headers["authorization"] &&
            req.headers["authorization"].startsWith("Bearer ")
        ) {
            jwt.verify(
                req.headers["authorization"].substring(7),
                secretKey,
                (err, decodedToken) => {
                    if (err) {
                        console.error("Error decoding token:", err);
                    } else {
                        activity = new Activity({
                            userId: decodedToken.user.id,
                            activityName,
                            duration,
                            caloriesBurned,
                            steps,
                            distance,
                            date,
                        });
                    }
                }
            );
            await activity.save();
            res.json(activity);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getActivityById = async (req, res) => {
    try {
        const id = req.params.id;
        const activities = await Activity.findById(id);
        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { activityName, duration, caloriesBurned, steps, distance } =
            req.body;
        const activity = await Activity.findByIdAndUpdate(
            id,
            {
                activityName,
                duration,
                caloriesBurned,
                steps,
                distance,
            },
            { new: true }
        );
        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        await Activity.findByIdAndDelete(id);
        res.json({ msg: "Activity deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
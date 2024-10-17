const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");
const { JWT_SECRET } = require("../config");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    try {
        const checkUserExist = await User.findOne({ username })
        if (checkUserExist) {
            return res.status(400).send({ message: "Username already exists" })
        }

        await User.create({ username, password });
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error(err);
        res.status(500).send({ message: "Error creating user" });
    }
});

router.post('/signin', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    const checkUserExist = await User.findOne({ username, password })
    if (checkUserExist) {
        const token = jwt.sign({ username }, JWT_SECRET);
        res.status(200).json({ token: token })
    } else {
        res.status(401).send({ message: "Invalid username or password" })
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const allCourses = await Course.find({});
    res.status(200).json({ courses: allCourses })
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.username;
    
    User.updateOne(
        { username: username },
        { "$push": { purchasedCourses: new mongoose.Types.ObjectId(courseId) } }
    )
        .catch((e) => {
            console.error(e);
        })
        .then((response) => {
            res.status(200).json({ message: "Course purchased successfully" });
        })
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username;

    User.findOne({ username })
        .then((response) => {

            Course.find({
                _id: { $in: response.purchasedCourses }
            })
                .then((coursesPurchased) => [
                    res.status(200).json({ purchasedCourses: coursesPurchased })
                ])
                .catch((e) => {
                    console.error(e);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

module.exports = router
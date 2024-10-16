const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    try {
        const checkUserExist = await Admin.findOne({username})
        if(checkUserExist) {
            return res.status(400).send({message: "Username already exists"})
        }

        await Admin.create({ username, password });
        res.status(201).send({ message: "Admin created successfully" });
    } catch (error) {
        console.error(err);
        res.status(500).send({ message: "Error creating admin" });
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;

    const course = await Course.create({ title, description, imageLink, price });
    res.status(200).json({ message: "Course created successfully", courseId: course._id })

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const allCourses = await Course.find({});
    res.status(200).json({ message: "Courses fetched successfully", courses: allCourses })
});

module.exports = router;
// import sendM ail from '../middlewares/mailMiddleware.js';
import MongoUser from "../database/mongoUser.js";
import MongoCourse from "../database/mongoCourse.js";

function generateRandomSixDigitNumber() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

class UserController {

    static async register(req, res) {
        const {username, email, password, course} = req.body;
        console.log("Data received: ", username, email, password, course);
        const User = MongoUser.getConnection();

        try {
            // Check if USER exists
            const existingUser = await User.collection('users').findOne({email: email});
            console.log(existingUser);

            if (existingUser) {
                if (!existingUser.valid) {
                    // Overwrite unverified user
                    const otp = generateRandomSixDigitNumber();
                    await User.collection('users').updateOne({email: email}, {
                        $set: {
                            username: username, password: password, otp: otp, valid: true, course_id: course
                        }
                    });
                    sendMail(email, otp);
                    return res.status(200).json({message: "OTP resent. Please verify your email."});
                } else {
                    return res.status(400).json({message: "User already registered and verified."});
                }
            }
            // Insert new user
            const otp = generateRandomSixDigitNumber();
            await User.collection('users').insertOne({
                username: username, email: email, password: password, otp: otp, valid: true, course_id: course
            });
            sendMail(email, otp);
            res.status(200).json({message: "User registered. Please verify your email."});
        } catch (error) {
            res.status(500).json({message: "Registration failed.", error: error.message});
        }
    }

    // static async otpProcesser(req, res) {
    //     const {email, otp} = req.body;
    //     const User = MongoUser.getConnection();
    //     try {
    //         const existingUser = await User.collection('users').findOne({email: email, otp: otp});
    //         if (!existingUser) {
    //             return res.status(400).json({message: "Invalid OTP or email."});
    //         }
    //         await User.collection('users').updateOne({email: email}, {$set: {valid: true}});
    //         res.status(200).json({message: "Email verified successfully."});
    //     } catch (error) {
    //         res.status(500).json({message: "OTP verification failed.", error: error.message});
    //     }
    // }

    static async login(req, res) {
        const {email, password} = req.body;
        const User = MongoUser.getConnection();
        const Course = MongoCourse.getConnection();
        try {
            const user = await User.collection('users').findOne({email: email, password: password});
            if (!user) {
                return res.status(400).json({message: "Invalid credentials."});
            }
            if (!user.valid) {
                return res.status(403).json({message: "User not verified. Please verify your email."});
            }
            const modules = await Course.collection('course').find({course_id: user.course_id}).toArray();
            if (!modules) {
                return res.status(404).json({message: "No modules found for this course."});
            }
            console.log(modules);

            res.status(200).json({
                message: "User logged in successfully.", user: {
                    email: user.email, username: user.username, modules: modules
                }
            });
        } catch (error) {
            res.status(500).json({message: "Login failed.", error: error.message});
        }
    }

    static async getUserByEmail(req, res) {
        const {email} = req.params;
        const User = MongoUser.getConnection();
        try {
            const user = await User.collection('users').findOne({email: email});
            if (!user) {
                return res.status(404).json({message: "User not found."});
            }
            res.status(200).json({message: "User retrieved successfully.", user: user});
        } catch (error) {
            res.status(500).json({message: "Failed to retrieve user.", error: error.message});
        }
    }

    static async getCoursesByEmail(req, res) {
        const {email} = req.body;
        console.log(email);
        const User = MongoUser.getConnection();
        const Course = MongoCourse.getConnection();
        try {
            const user = await User.collection('users').findOne({email: email});
            if (!user) {
                return res.status(404).json({message: "User not found."});
            }
            const courses = await Course.collection('course').find({course_id: user.course_id}).toArray();
            if (!courses || courses.length === 0) {
                return res.status(404).json({message: "No courses found for this user."});
            }
            res.status(200).json({message: "Courses retrieved successfully.", courses: courses});
        } catch (error) {
            res.status(500).json({message: "Failed to retrieve courses.", error: error.message});
        }
    }

    static async getAllCourses(req, res) {
        const Course = MongoCourse.getConnection();
        try {
            const courses = await Course.collection('course').find({}).toArray();
            if (!courses || courses.length === 0) {
                return res.status(404).json({message: "No courses found."});
            }
            res.status(200).json({message: "Courses retrieved successfully.", courses: courses});
        } catch (error) {
            res.status(500).json({message: "Failed to retrieve courses.", error: error.message});
        }
    }

    static async setCourse(req, res) {
        const {email, course_id} = req.body;
        if (!email || !course_id) {
            return res.status(400).json({message: "Email and course_id are required."});
        }
        console.log(email, course_id);
        const new_course_id = parseInt(course_id, 10);
        const User = MongoUser.getConnection();
        try {
            const user = await User.collection('users').findOne({email: email});
            if (!user) {
                return res.status(404).json({message: "User not found."});
            }
            await User.collection('users').updateOne({email: email}, {$set: {course_id: new_course_id}});
            res.status(200).json({message: "Course set successfully."});
        } catch (error) {
            res.status(500).json({message: "Failed to set course.", error: error.message});
        }
    }

    static async registerCourse(req, res) {
        const {title, modules} = req.body;
        if (!title || !Array.isArray(modules)) {
            return res.status(400).json({message: "Title and modules array are required."});
        }
        const Course = MongoCourse.getConnection();
        try {
            // Find the highest course_id
            const lastCourse = await Course.collection('course')
                .find({})
                .sort({course_id: -1})
                .limit(1)
                .toArray();
            const nextCourseId = lastCourse.length > 0 ? lastCourse[0].course_id + 1 : 1;

            await Course.collection('course').insertOne({
                title: title, modules: modules, course_id: nextCourseId
            });
            res.status(200).json({message: "Course registered successfully.", course_id: nextCourseId});
        } catch (error) {
            res.status(500).json({message: "Failed to register course.", error: error.message});
        }
    }
}

export default UserController;
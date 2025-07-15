import {Router} from 'express'
import UserController from '../controllers/userController.js';

const router = Router();

router.post("/login", async (req, res) => {
    await UserController.login(req, res)
});

router.post("/register", async (req, res) => {
    await UserController.register(req, res)
});

router.post("/register/otp", async (req, res) => {
    await UserController.otpProcesser(req, res)
});

router.get("/getCourses", async(req, res) =>{
    await UserController.getAllCourses(req, res);
});

router.post("/setCourse", async (req, res) => {
    await UserController.setCourse(req, res);
})

router.post("/getCoursesByEmail", async (req, res) => {
    await UserController.getCoursesByEmail(req, res);
})

router.post("/registerCourse", async (req, res) => {
    await UserController.registerCourse(req, res);
})

export default router;


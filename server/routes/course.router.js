import { Router } from "express";
import { getAllCourses, getLecturesByCourseId } from "../controllers/course.controller.js";
import isLoggedin from "../middleware/auth.middleware.js";

const router = Router();

// router.get("/", getAllCourses)
router.route("/").get(getAllCourses)
// router.get("/:id", getLecturesByCourseId)
router.route("/:id").get(isLoggedin,getLecturesByCourseId)


export default router


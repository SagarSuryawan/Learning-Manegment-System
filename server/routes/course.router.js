import { Router } from "express";
import { createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from "../controllers/course.controller.js";
import { isLoggedin, AuthorizedRoles } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

// router.get("/", getAllCourses)  if admin in "/" path hit post request then create course flow 
router.route("/").get(getAllCourses)
                 .post(isLoggedin,AuthorizedRoles('ADMIN') , upload.single('thumbnail'),createCourse)
                //  upload thumbnail photo in createCourse route
                 

// router.get("/:id", getLecturesByCourseId),for action taken place on indivisual course 
router.route("/:id").get(isLoggedin, getLecturesByCourseId)
                    .put(isLoggedin,AuthorizedRoles('ADMIN'), updateCourse)
                    .delete(isLoggedin,AuthorizedRoles('ADMIN'), removeCourse)
                    .post(isLoggedin,AuthorizedRoles('ADMIN'),addLecturesToCourseId)


export default router


import Course from "../model/course.model.js"
import AppError from "../utils/error.utils.js"



const getAllCourses = async(req,res,next) =>{
    try {
        const courses = await Course.find({}).select("-lectures")
        res.status(200).json({
            success:true,
            message:"All Courses",
            courses
        })
        
    } catch (error) {
        return next(new AppError(error.message,400))
    }
}
const getLecturesByCourseId = async(req,res,next) =>{

    try {
        const { id } = req.params

        const course = await Course.findById(id)

        if(!course){
            return next(new AppError("Course does not exists",400))
        }

        res.status(200).json({
            success:true,
            message:"Course lectures fetched successfully",
            lectures:course.lectures 
        })


    } catch (error) {
        return next(new AppError(error.message,400))
    }
}


export {
    getAllCourses,
    getLecturesByCourseId
}
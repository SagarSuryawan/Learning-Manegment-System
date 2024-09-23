import Course from "../model/course.model.js";
import AppError from "../utils/error.utils.js";
import fs from "fs/promises";
import cloudinary from "cloudinary"




const getAllCourses = async(req,res,next) =>{
    try {
        const courses = await Course.find({}).select("-lectures")

        if (!courses || courses.length === 0) {
            // If no courses are found, return a 404 response with a message
            return next(new AppError("No Course Found",400))
            };
          
        res.status(200).json({
            success:true,
            message:"All Courses",
            courses
        })
        
    } catch (error) {
        return next(new AppError(error.message,400))
    }
}

// get lectures
const getLecturesByCourseId = async(req,res,next) =>{

    try {
        const { id } = req.params

        const course = await Course.findById(id)

        if(!course){
            return next(new AppError("Invalid Course id",400))
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

// create course for admin
const createCourse = async(req,res,next) =>{
    const { title, description,category, createdBy } = req.body

    if( !title || !description || !category || !createdBy){
        return next(new AppError('All Feild Are Required',400))
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy
    })

    if(!course){
        return next(new AppError('Course Could not be Created,try Again',400))
    }
    // check file realated 
    if(req.file){
       
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder:'LMS'
            })
            if(result)
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url = result.secure_url
    
            // remove file
            fs.rm(`uploads/${req.file.filename}`)
    

            res.status(200).json({
                success:true,
                message:"Course Created successfully",
                course 
            })
        } catch (error) {
            return next(new AppError(e.message,400))
        }
        
    }

    await course.save()

}

// update course by admin
const updateCourse = async(req,res,next) =>{

    try {
        const { id } = req.params
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set:req.body
            },
            // overwrite information
            {
                runValidators:true
            }
            // it examin value are correct on the bassis of mongoose

        );

        if(!course){
            return next(new AppError('course does not exists',400))
        }

        res.status(200).json({
            success:true,
            message:"Course Updated Sucessfully",
            course
        })
    } catch (error) {
        return next(new AppError(e.message,400))
    }

}

// remove course by admin
const removeCourse = async(req,res,next) =>{

}


export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse
}
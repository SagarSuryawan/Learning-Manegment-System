import { model,Schema } from "mongoose";

const courseSchema = new Schema({

    title:{
        type:String,
        required:[true,'Title is Required'],
        minLength:[10,'Title must be aleast 10 character'],
        maxLength:[20,'Title must be less than 20 character'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Description is Required'],
        minLength:[10,'description must be aleast 10 character'],
        maxLength:[150,'description must be less than 150 character'],
        trim:true
    },
    category:{
        type:String,
        required:[true,'Category is Required']
    },
    thumbnail:{
        public_id:String,
        secure_url:String
        
    },
    lectures:[
        {
            title:String,
            description:String,
            lecture:{
                public_id:{
                    type:String,
                    required:true
                },
                secure_url:{
                    type:String,
                    required:true
                }
            }
        }
    ],
    numbersOfLectures:{
        type:Number,
        default:0, 
    },
    createdBy:{
        type:String,
        required:true
    }

},{
    timestamps:true
})

const Course = model('Course',courseSchema);
// model("Course",courseSchema) =>  Course is data collection name,courseSchema is name of schema name of course.

export default Course

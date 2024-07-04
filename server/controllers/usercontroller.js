import AppError from "../utils/error.utils.js"
import USER from "../model/user.model.js"


const register =async (req,res,next) => {
    const { fullname, email, password } = req.body

    if(!fullname || !email || !password){
        return next (new AppError("All feild are required",400))
    }
    const userExists = await USER.findOne({email})



    if(userExists){
        return next(new AppError ("email already registered",400))
    }
// 2step creat user 1) basic info stored in database full,email,password
    const user = await USER.create({
        fullname,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:'www.google.com'
        }
    }) 

    if(!user){
        return next (new AppError ('user not created successfully',400))
    }
    //TODO:File Upload
        
    await user.save()
    user.password = undefined

    res.status(200).json({
        success:true,
        message:"user registerd successfully",
        user
    })
}

const signin = (req,res)=> {

}

const logout = (req,res) => {

}

const getprofile = (req,res) =>{

}

export {
    register,
    signin,
    logout,
    getprofile
}

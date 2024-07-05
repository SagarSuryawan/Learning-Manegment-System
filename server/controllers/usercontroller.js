import AppError from "../utils/error.utils.js"
import USER from "../model/user.model.js"

const cookieOption = {
    maxAge:7 * 24 * 60 * 60 * 1000,
    secure:true,
    httpOnly:true 
}

const register =async (req,res,next) => {
    const { fullname, email, password } = req.body

    if(!fullname || !email || !password){
        return next (new AppError("All feild are required",400))
        // class AppError
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
        return next (new AppError ('user not registered',400))
    }
    //TODO:File Upload
        
    await user.save()
    // to assure that user data saved in databse
    user.password = undefined

    const token  = await user.jwtToken()

    res.cookie("token",token,cookieOption)

    res.status(200).json({
        token,
        success:true,
        message:"user registerd successfully",
        user
    })
    
}

const signin = async(req,res,next)=> {
    try {
        const { email, password } = req.body
    if(!email || !password){

        return next (new AppError ("All Feild Are Required",400))
    }

    const user = await USER.findOne({email}).select('+password')

    // if user not exists or user password does not match,then return error
    if(!user || !user.comparePassword(password)){
        return next (new AppError ("user or password does not match",400))
    }

    const token = await user.jwtToken()
    user.password = undefined

    res.cookie("token",token,cookieOption)
    
    res.status(200).json({
        success:true,
        message:"user login successfully",
        user
    })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
    
}

const logout = (req,res) => {
    res.cookie("token",null,{
        secure:true,
        maxAge:0,
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"user logout successfully"
    })
}

const getprofile = async(req,res,next) =>{
    // beacause you are already logged (means you have tokon exists in  cookie) in that 's why you can get profile info.
    // so i can retrive info from token and add in request.
    try {
        const userid = req.user.id
        const user = await USER.findById(userId);

        res.status(200).json({
            success:true,
            message:"user information",
            user
        })
        
    } catch (e) {
        return next(new AppError(e.message,400))
    }
    
}

export {
    register,
    signin,
    logout,
    getprofile
}

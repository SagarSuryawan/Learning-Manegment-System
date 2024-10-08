import AppError from "../utils/error.utils.js"
import USER from "../model/user.model.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto"

const cookieOption = {
    maxAge:7 * 24 * 60 * 60 * 1000,
    secure:true,
    httpOnly:true 
}

const register = async (req,res,next) => {
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
    //File Upload
    //converted file got in request
    
    if(req.file){
        // upload in cloudinary 
        try {
            // upload the file to Cloudinary.cloudinary.v2.uploader.upload method uploads the file located at req.file.path.
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'LMS',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill'
            });
            // if i got a result 
            if(result){
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url

                // remove file local 
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (e) {
            return next(new AppError (e.message || 'File not uploaded',500))
        }
    }
        
    await user.save()
    // to assure that user data saved in databse
    user.password = undefined

// user can automatically signin

    const token  = await user.jwtToken()

    res.cookie("token",token,cookieOption)

    res.status(200).json({
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
    console.log(token)
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

const logout = (req,res,next) => {
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
        const user = await USER.findById(userid);

        res.status(200).json({
            success:true,
            message:"user information",
            user
        })
        
    } catch (e) {
        return next(new AppError(e.message,400))
    }
    
}

const forgotPassword = async(req,res,next) =>{ 
console.log("server is starting")
    const {email} = req.body

    if(!email){
        return next(new AppError("Enter Email", 400))
    }

    const user = await USER.findOne({email})

    if(!user){
        return next(new AppError("Email is not Registered",400))
    }
    // genrate random URL, before genrate URL reset Token is require.
    const resetToken = await user.genratePasswordResetToken()

    // store a reset token in database  and genrate URL.4
    await user.save()

    const resetPasswordUrl = `http://localhost:5055/user/reset-password/${resetToken}`
    // change resetPasswordUrl after frotend done.

    console.log("url: ",resetPasswordUrl)
    // 
    const subject = 'Reset Password';
  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

    // email send
    try{
        await sendEmail(email,subject,message)

        res.status(200).json({
            success:true,
            message:`Reset Password token has been sent to ${email} successfully`
        })
    }catch(e){
        // for any reason email not send
        user.forgotpasswordexpiry = undefined;
        user.forgotpasswordToken = undefined 

        await user.save()
        return next(new AppError(e.message,500))
    }
    // send mail utility
}

const resetPassword = async(req,res,next) =>{

    // data comes int he form of params,This is extracted from the URL parameters
     const { resetToken } = req.params   

     const { password } = req.body

     if (!password) {
        return next(new AppError('Password is required', 400));
      }

     const forgotpasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //  Hashing: The resetToken received from the user is hashed using the SHA-256 algorithm. This is done to match it against the hashed token stored in the database. Storing hashed tokens instead of plain text tokens enhances security.
    // Digest in Hex: The .digest('hex') method converts the hash to a hexadecimal string, which is a common format for storing hashed data


     const user = await USER.findOne({
        forgotpasswordToken,
        forgotpasswordexpiry: { $gt: Date.now() }
     })
    //  This query searches the database for a user document that matches the hashed token and has a forgotPasswordExpiry field that is greater than the current time (i.e., the token is still valid).


     if(!user){
        return next(new AppError('token is expired,try again',400))
     }

     user.password = password
     user.forgotpasswordToken = undefined
     user.forgotpasswordexpiry = undefined
    //  The user's password is updated with the new password provided in the request.After successfully resetting the password, the forgotPasswordToken and forgotPasswordExpiry fields are set to undefined, effectively removing them from the user's document. This ensures the token cannot be reused.

     await user.save()
     

     res.status(200).json({
        success:true,
        message:'Password Change Successfully'
     })
}

const changePassword = async(req,res,next) =>{
// steps:- need old password and new password , check old password is correct or not ,if correct then update with new password.
    const { oldPassword, newPassword } = req.body

    const {id} = req.user

    if( !oldPassword || !newPassword ){
        return next(new AppError('All feild are required',400))
    } 

    const user = await USER.findById(id).select('+password')

    if(!user){
        return next(new AppError('User does not exists',400))
    }

    const isPasswordValid = await user.comparePassword(oldPassword)

    if(isPasswordValid){
        return next(new AppError('Password does not match',400))
    }

    user.password = newPassword

    await user.save()

    user.password = undefined;

    res.status(200).json({
        success:true,
        message:"password changed successfully"
    })

}

const updateUser = async(req,res,next) =>{

// update fullname and profile picture
    const { fullName } = req.body
    const { id } = req.user

    const user = await USER.findById(id)
    // console.log("userrr",user);

    if(!user){
        return next (new AppError('user does not exists',400))
    }
    // modififcation
    if (fullName){
        user.fullname = fullName
    }
    // passed from multer
    if (req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        // next step exactly same as upload in file in register  

        try {
            // upload the file to Cloudinary.cloudinary.v2.uploader.upload method uploads the file located at req.file.path.
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'LMS',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill'
            });
            // if i got a result 
            if(result){
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url

                // remove file local 
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (e) {
            return next(new AppError (e.message || 'File not uploaded',500))
        }
    }
    await user.save()

    res.status(200).json({
        success:true,
        message:"user details updated successfully"
    })

}

export {
    register,
    signin,
    logout,
    getprofile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
}

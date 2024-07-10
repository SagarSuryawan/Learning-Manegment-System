import AppError from "../utils/error.utils.js"
import jwt from 'jsonwebtoken'

const isLoggedin = async(req,res,next)=>{

    const {token} = req.cookies 

    
    if(!token){
        return next(new AppError("User not Authorized",401))
    }

    const userDetail = await jwt.verify(token,process.env.SECRET)
    req.user = userDetail
    next()
}

export default isLoggedin
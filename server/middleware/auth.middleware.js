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


const AuthorizedRoles = (...roles) => async (req,res,next) =>{

    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)){
        return next (new AppError('you do not have permission',403))
    }
    next();
}

export {
    isLoggedin,
    AuthorizedRoles
}

// Note:- (...roles) collects all the roles passed as arguments (e.g., ['admin', 'editor']) when you use this middleware.
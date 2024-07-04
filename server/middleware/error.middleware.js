
    const errormiddleware = (error,req,res,next)=>{

        error.message = error.message || "Something went wrong"
        error.status = error.status || 500

        return res.status(error.status).json({
            success:false,
            message:error.message,
            stack:error.stack
        })
    }

    export default errormiddleware
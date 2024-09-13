import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser" 
import morgan from "morgan"
import userroutes from "./routes/user_routes.js"
import errormiddleware from "./middleware/error.middleware.js"
// courses
import courseroutes from "./routes/course.router.js"


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin:[process.env.frontendUrl],
    credentials:true
}))

app.use(cookieParser())

app.use (morgan("dev"))

app.use("/ping", function(req,res){
    res.send(" Yes, Server is up")
})
// this is for check is server up or not


// Routes of three modules 

app.use("/user",userroutes)
app.use("/courses",userroutes)

app.all("*", (req,res) => {
    res.status(404)
    res.send('OOPS! 404 Page Not Found')
})

app.use(errormiddleware)

export default app;

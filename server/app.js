import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser" 
import morgan from "morgan"

const app = express()
app.use(express.json())

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

app.all("*", (req,res) => {
    res.status(404)
    res.send('OOPS! 404 Page Not Found')
})


export default app;

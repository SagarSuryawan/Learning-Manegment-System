import dotenv from 'dotenv';
import connectiondb from './config/db.js';
import app from "./app.js"
import cloudinary from "cloudinary"

dotenv.config();

const port = process.env.PORT || 6066

// cloudinary configuration
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.listen(port, async() =>{
    await connectiondb()
    console.log(`app is running on port ${port}`)
})

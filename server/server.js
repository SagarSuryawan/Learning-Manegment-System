import dotenv from 'dotenv';
import connectiondb from './config/db.js';
import app from "./app.js"

dotenv.config();

const port = process.env.PORT || 6066

app.listen(port, async() =>{
    await connectiondb()
    console.log(`app is running on port ${port}`)
})
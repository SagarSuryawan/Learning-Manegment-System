import dotenv from 'dotenv';
dotenv.config();
import connectiondb from './config/db.js';

import app from "./app.js"

const port = process.env.PORT || 6066

app.listen(port, async() =>{
    await connectiondb()
    console.log(`app is running on port ${port}`)
})
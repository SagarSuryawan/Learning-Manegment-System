

// Summary:This code configures the multer middleware to handle file uploads in a Node.js application. It sets constraints on the file size and type, ensuring that only allowed files are uploaded and stored in a specific directory on the server. This setup is essential for building functionalities like user profile picture uploads, media content uploads, etc., within a web application.

import path from "path"
import multer from  "multer"

const upload = multer({
    dest:"uploads/",
    // file upload on this path.
    limits:{fileSize: 10 * 1024 * 1024},
    // file size upto
    storage:multer.diskStorage({
        destination:"uploads/",
        filename:(req,file,cb) =>{
            cb(null,file.originalname)
        },
        // dest is simpler and provides a quick way to store files with default settings, whereas storage offers full customization over the storage process.
    }),

    fileFilter:(req,file,cb) =>{
        let ext = path.extname(file.originalname);
        
        if( 
        ext !== ".jpg" &&
        ext !== ".jpeg" &&
        ext !== ".webp" &&
        ext !== ".png" &&
        ext !== ".mp4"
        )
    
    {
        cb(new Error(`Unsupported file type ! ${ext}`),false)
        return
    }
    cb(null,true)
    }
})

export default upload

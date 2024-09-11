import {Router} from "express"
import { getprofile ,register,signin,logout, forgotPassword, resetPassword, changePassword, updateUser } from "../controllers/usercontroller.js";
import isLoggedin from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router()

router.post("/register",upload.single("avatar"),register);

// upload.single("avatar") 
// avatar is a data key.
// .single is for one file.

router.post("/signin",signin)
router.get("/logout",logout)
router.get("/me", isLoggedin,getprofile)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword)
router.post("/change-password", isLoggedin,changePassword)
// change-password method is used when user knew his passwrd and user wants to change to change it.
router.put("/update",isLoggedin, upload.single("avatar"), updateUser)


export default router
import {Router} from "express"
import { getprofile ,register,signin,logout} from "../controllers/usercontroller.js";
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

export default router
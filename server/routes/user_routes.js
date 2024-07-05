import {Router} from "express"
import { getprofile ,register,signin,logout} from "../controllers/usercontroller.js";
import isLoggedin from "../middleware/auth.middleware.js";


const router = Router()

router.post("/register",register);
router.post("/signin",signin)
router.get("/logout",logout)
router.get("/me", isLoggedin,getprofile)

export default router
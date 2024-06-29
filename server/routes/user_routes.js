import {Router} from "express"
 
import { getprofile ,register,signin,logout} from "../controllers/usercontroller.js";

const router = Router()

router.post("/register",register);
router.post("/signin",signin)
router.get("/logout",logout)
router.get("/me",getprofile)

export default router
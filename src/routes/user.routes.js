import { Router } from "express";
import { logOut, loginUser, registerUser } from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js"

export const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar" },
        { name: "coverImage" }
    ]),
    registerUser
)

router.route("/login").post(
    loginUser
)

//secured routes
router.route("/logout").post(
    verifyJwt,
    logOut
)

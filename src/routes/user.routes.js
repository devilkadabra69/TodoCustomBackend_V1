import { Router } from "express";
import { logOut, loginUser, registerUser } from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js"

export const router = Router();

const debugMiddleware = (req, res, next) => {
    console.log(`FROM debug Middleware Received ${req.method} request for ${req.url}`);
    console.log('FROM debug Middleware Request Body:', req.body);
    console.log('FROM debug Middleware Files:', req.files || "There is no files attached");
    next();
};

router.route("/register").post(
    upload.fields([
        { name: "avatar" },
        { name: "coverImage" }
    ]),
    debugMiddleware,
    registerUser
)

router.route("/login").post(
    debugMiddleware,
    loginUser
)

//secured routes
router.route("/logout").post(
    verifyJwt,
    debugMiddleware,
    logOut
)

import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js";

export const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar" },
        { name: "coverImage" }
    ]),
    registerUser
)

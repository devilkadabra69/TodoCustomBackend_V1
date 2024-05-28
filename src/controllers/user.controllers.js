import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.models.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;

    if ([fullName, userName, email, password].some((e) => e?.trim() === "")) {
        throw new ApiError("All Fields Are Required", 400);
    }

    const isUserThere = await User.findOne({ $or: [{ userName }, { email }] });
    if (isUserThere) {
        throw new ApiError("User Already Exists", 409);
    }

    let avatar = "";
    let coverImage = "";

    if (req.files && (req.files.avatar || req.files.coverImage)) {
        if (req.files.avatar) {
            const avatarLocalPath = req.files.avatar[0].path;
            avatar = await uploadToCloudinary(avatarLocalPath);
        }

        if (req.files.coverImage) {
            const coverImageLocalPath = req.files.coverImage[0].path;
            coverImage = await uploadToCloudinary(coverImageLocalPath);
        }
    } else {
        console.log(req.files, "its undefined");
    }

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
        avatar: avatar.url || "",
        coverImage: coverImage.url || "",
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError("User Not Created: Something went wrong while creating the user", 500);
    }

    return res.status(201).json(
        new ApiResponse(200, "User Registered Successfully")
    );
});

export { registerUser };

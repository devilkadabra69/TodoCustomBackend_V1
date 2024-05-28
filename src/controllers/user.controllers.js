import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.models.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { COOKIE_OPTIONS } from '../constants.js';

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return new ApiError("\nUnable to generateAccessTokenAndRefreshToken since user not matched with the id supplied FROM LINE 9 :: user.controllers.js\n", 404);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        user.save({
            validateBeforeSave: false
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error(error?.message, "FROM LINE 17 :: user.controllers.js");
        return null;
    }

}

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

//login controller for the user
const loginUser = asyncHandler(async (req, res) => {
    /*
    algo for login 
    -> check email , password or username (will take either username or email for login)
    -> if user exists , check the password
    -> check for accessTokens and refreshTokens
    -> send cookies
    
    */
    const { userName, email, password } = req.body;

    if (!(userName || email)) {
        throw new ApiError("userName or email is required :: LINE 69 user.controllers.js", 400);
    }
    if (!password) {
        throw new ApiError("password is required :: LINE 72 user.controllers.js", 400);
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) throw new ApiError("User Not Found :: LINE 79 user.controllers.js", 404);

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) throw new ApiError("Password is incorrect :: LINE 83 user.controllers.js", 401);

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user?._id);

    const loggedInUser = await User.findById(user?._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(new ApiResponse(200, "User Logged In Successfully", {
            loggedInUser,
            accessToken,
            refreshToken
        }));
})

const logOut = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) return new ApiError("User Not Found :: LINE 125 user.controllers.js", 404)
    const id = user._id;
    await User.findByIdAndUpdate(id, { $set: { refreshToken: "" } }, { new: true });
    return res.status(200).clearCookie("accessToken", "", COOKIE_OPTIONS).clearCookie("refreshToken", "", COOKIE_OPTIONS)
        .json(new ApiResponse(200, "User Logged Out Successfully", {}));
})

export {
    generateAccessTokenAndRefreshToken,
    registerUser,
    loginUser,
    logOut
};

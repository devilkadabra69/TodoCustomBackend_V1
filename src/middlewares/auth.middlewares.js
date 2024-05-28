import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const incomingAccessToken = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        const incomingAccessToken_2 = req.header('authorization')?.replace('Bearer ', '') || req.cookies?.accessToken;
        console.log("incoming access token with authorization ", incomingAccessToken_2);
        console.log("incoming access token with Authorization ", incomingAccessToken);
        if (!(incomingAccessToken || incomingAccessToken_2)) return new ApiError('Unauthorized ACCESS TOKEN :: LINE 9 FROM auth.middlewares.js\n', 401)
        const decodedToken = jwt.verify(incomingAccessToken, process.env.ACCESS_TOKEN_SECRET)

        if (!decodedToken) return new ApiError('Unauthorized ACCESS TOKEN :: LINE 12 FROM auth.middlewares.js\n', 401);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        //TODO: Will discuss later
        if (!user) return new ApiError('User not found with the given the given access token || INVALID ACCESS TOKEN  :: LINE 17 FROM auth.middlewares.js\n', 401);

        req.user = user;
        next();
    } catch (error) {
        console.error(error?.message);
        return new ApiError('Unauthorized ACCESS TOKEN :: LINE 25s FROM auth.middlewares.js\n', 401)
    }
})
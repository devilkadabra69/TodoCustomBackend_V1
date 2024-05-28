import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { SALT_ROUNDS } from "../constants.js";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
        },
        coverImage: {
            type: String, //cloudinary url
        },
        userAddress: {
            type: Schema.Types.ObjectId,
            ref: "UserAddress"
        },
        password: {
            type: String,
            required: [true, "Please provide a password"]
        },
        refreshToken: {
            type: String
        },
        todos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Todo",
            }
        ],
        folders: [
            {
                type: Schema.Types.ObjectId,
                ref: "TodoFolder"
            }
        ]
    }, {
    timestamps: true
}
)
//don't use pre type mongoose middleware with arrow function beacause it doesn't know the context always use function
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        next();
    } else {
        return next();
    }
})

// now one problem if anybody changes any data then pre runs to avoid un necessary run of pre or only in changes of password we write an if condition for any modification


// methods are the hooks where we create our own custom method
//below compares the password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);//User is the name of the collection
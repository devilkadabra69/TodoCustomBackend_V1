import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    color: {
        type: String,
        default: "#FFFFE0"
    },
    title: {
        type: String,
        required: true,
        default: "Untitled"
    },
    content: {
        type: String,
        default: ""
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Todo = mongoose.model("Todo", todoSchema);
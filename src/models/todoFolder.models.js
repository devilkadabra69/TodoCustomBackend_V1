import mongoose from "mongoose";

const todoFolderSchema = mongoose.Schema({
    folderTitle: {
        type: String,
        default: "Untitled Folder",
        index: true
    },
    folderColor: {
        type: String,
        default: "#FFFFFF"
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo"
        }
    ]
})

export const TodoFolder = mongoose.model("TodoFolder", todoFolderSchema);
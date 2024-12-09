import mongoose from "mongoose"
import { IPost } from "./types"

const postSchema = new mongoose.Schema<IPost>({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    desc : {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    comments: {
        type: [String],
        default: []
    },
    categories: {
        type: [String],
        default: []
    }
}, { timestamps: true })


export const Post = mongoose.model<IPost>('Post', postSchema)

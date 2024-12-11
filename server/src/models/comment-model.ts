import mongoose from "mongoose";
import { IComment } from "./types";

const commentSchema = new mongoose.Schema<IComment>(
  {
    username: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);

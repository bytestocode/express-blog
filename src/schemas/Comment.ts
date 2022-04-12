// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;
import { Schema, model } from "mongoose";

interface IComment {
  commenter: string;
  comment: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  commenter: { type: String, required: true },
  comment: { type: String, required: true },
  // createdAt: { type: Date, default: Date.now() },
  createdAt: { type: Date, default: Date.now },
});

// module.exports = model("Comment", commentSchema);
const Comment = model<IComment>("Comment", commentSchema);
export default Comment;

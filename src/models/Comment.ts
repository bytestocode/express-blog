import { Schema, model } from "mongoose";

interface IComment {
  commenter: string;
  comment: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  commenter: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;

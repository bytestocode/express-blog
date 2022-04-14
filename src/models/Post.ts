import { Schema, Types, model } from "mongoose";

interface IPost {
  title: string;
  author: string;
  contents: string;
  createdAt: Date;
  comments: Array<Types.ObjectId>;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  contents: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const Post = model<IPost>("Post", postSchema);
export default Post;

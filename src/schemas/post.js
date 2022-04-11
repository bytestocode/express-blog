const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  contents: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = model("Post", postSchema);

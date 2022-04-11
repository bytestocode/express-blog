const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const commentSchema = new Schema({
  commenter: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = model("Comment", commentSchema);

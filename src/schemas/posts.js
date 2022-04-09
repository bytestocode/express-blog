const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  comments: {
    type: Array,
  },
});

module.exports = mongoose.model("Posts", postsSchema);

const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");

router.get("/", async (req, res) => {
  let posts = await Post.find({}).sort({ createdAt: -1 });
  return res.render("mainPage", { posts });
});

router.get("/posts", (req, res) => {
  return res.render("writePage");
});

router.post("/posts", async (req, res) => {
  const { title, author, contents } = req.body;

  await Post.create({
    title,
    author,
    contents,
  });

  return res.redirect("/");
});

router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("comments");

  return res.render("detailPage", { post });
});

router.get("/posts/:id/edit", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  return res.render("editPage", { post });
});

router.post("/posts/:id/edit", async (req, res) => {
  const { title, author, contents } = req.body;
  const { id } = req.params;
  await Post.findByIdAndUpdate(id, { $set: { title, author, contents } });
  return res.redirect(`/posts/${id}`);
});

router.get("/posts/:id/delete", async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  return res.redirect("/");
});

router.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { commenter, comment } = req.body;
  const newComment = await Comment.create({
    commenter,
    comment,
  });

  const post = await Post.findById(id);
  post.comments.push(newComment._id);
  post.save();

  return res.redirect(`/posts/${id}`);
});

router.get("/posts/:id/:commentId/delete", async (req, res) => {
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);

  const post = await Post.findById(id);
  post.comments.pull(comment._id);
  post.save();

  await Comment.findByIdAndDelete(commentId);

  return res.redirect(`/posts/${id}`);
});

router.get("/posts/:id/:commentId/edit", async (req, res) => {
  console.log("댓글 수정 페이지");
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  const post = await Post.findById(id).populate("comments");
  console.log(comment);
  console.log(post);

  return res.render("detailPage", { post, comment });
});

router.post("/posts/:id/:commentId/edit", async (req, res) => {
  const { id, commentId } = req.params;
  const { commenter, comment } = req.body;

  const delComment = await Comment.findByIdAndUpdate(commentId, {
    $set: {
      commenter,
      comment,
    },
  });

  return res.redirect(`/posts/${id}`);
});

module.exports = router;

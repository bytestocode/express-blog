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

  try {
    await Post.create({
      title,
      author,
      contents,
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("writePage", {
      errorMessage: error.message,
    });
  }
});

router.get("/posts/:id([0-9a-f]{24})", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("comments");

  if (!post) {
    return res.status(404).render("404Page");
  }

  return res.render("detailPage", { post });
});

router.get("/posts/:id([0-9a-f]{24})/edit", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).render("404Page");
  }

  return res.render("editPage", { post });
});

router.post("/posts/:id([0-9a-f]{24})/edit", async (req, res) => {
  const { title, author, contents } = req.body;
  const { id } = req.params;

  const post = await Post.exists({ _id: id });
  if (!post) {
    return res.status(404).render("404Page");
  }

  await Post.findByIdAndUpdate(id, { $set: { title, author, contents } });
  return res.redirect(`/posts/${id}`);
});

router.get("/posts/:id([0-9a-f]{24})/delete", async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate("comments");
  if (!post) {
    return res.status(404).render("404Page");
  }

  // post와 연관된 comments도 DB에서 삭제
  const { comments } = post;
  for (const comment of comments) {
    await Comment.findByIdAndDelete(comment._id);
  }

  console.log(comments);

  await Post.findByIdAndDelete(id);
  return res.redirect("/");
});

router.post("/posts/:id([0-9a-f]{24})/comments", async (req, res) => {
  const { id } = req.params;
  const { commenter, comment } = req.body;

  try {
    const newComment = await Comment.create({
      commenter,
      comment,
    });

    const post = await Post.findById(id);
    post.comments.push(newComment._id);
    post.save();

    return res.redirect(`/posts/${id}`);
  } catch (error) {
    return res.status(400).render(`/posts/${id}`, {
      errorMessage: error.message,
    });
  }
});

router.get(
  "/posts/:id([0-9a-f]{24})/:commentId([0-9a-f]{24})/delete",
  async (req, res) => {
    const { id, commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).render("404Page");
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).render("404Page");
    }
    post.comments.pull(comment._id);
    post.save();

    await Comment.findByIdAndDelete(commentId);

    return res.redirect(`/posts/${id}`);
  }
);

router.get(
  "/posts/:id([0-9a-f]{24})/:commentId([0-9a-f]{24})/edit",
  async (req, res) => {
    const { id, commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).render("404Page");
    }

    const post = await Post.findById(id).populate("comments");
    if (!post) {
      return res.status(404).render("404Page");
    }

    return res.render("detailPage", { post, comment });
  }
);

router.post(
  "/posts/:id([0-9a-f]{24})/:commentId([0-9a-f]{24})/edit",
  async (req, res) => {
    const { id, commentId } = req.params;
    const { commenter, comment } = req.body;

    const delComment = await Comment.exists({ _id: commentId });
    if (!delComment) {
      return res.status(404).render("404Page");
    }

    await Comment.findByIdAndUpdate(commentId, {
      $set: {
        commenter,
        comment,
      },
    });

    return res.redirect(`/posts/${id}`);
  }
);

module.exports = router;

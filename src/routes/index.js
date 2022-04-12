const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");

// GET- 전체 포스트 조회
router.get("/", async (req, res) => {
  let posts = await Post.find({}).sort({ createdAt: -1 });
  return res.render("mainPage", { posts });
});

// GET- 새글 작성 페이지
router.get("/posts", (req, res) => {
  return res.render("writePage");
});

// POST- 새글 DB에 저장 후 메인 페이지로 redirect
router.post("/posts", async (req, res) => {
  const { title, author, contents } = req.body;

  // DB에 새글 등록 중 에러 발생시 try...catch 처리
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

// GET- 특정 글 조회 페이지
router.get("/posts/:id([0-9a-f]{24})", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("comments");

  // ID로 조회 실패시 404 페이지 렌더
  if (!post) {
    return res.status(404).render("404Page");
  }

  return res.render("detailPage", { post });
});

// GET- 특정 글 수정 페이지
router.get("/posts/:id([0-9a-f]{24})/edit", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  // ID로 조회 실패시 404 페이지 렌더
  if (!post) {
    return res.status(404).render("404Page");
  }

  return res.render("editPage", { post });
});

// POST- 특정 글 수정 후 해당 글 조회 페이지로 redirect
router.post("/posts/:id([0-9a-f]{24})/edit", async (req, res) => {
  const { title, author, contents } = req.body;
  const { id } = req.params;

  const post = await Post.exists({ _id: id });
  // ID로 조회 실패시 404 페이지 렌더
  if (!post) {
    return res.status(404).render("404Page");
  }

  await Post.findByIdAndUpdate(id, { $set: { title, author, contents } });
  return res.redirect(`/posts/${id}`);
});

// GET- 특정 글 삭제하기
router.get("/posts/:id([0-9a-f]{24})/delete", async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate("comments");
  // ID로 조회 실패시 404 페이지 렌더
  if (!post) {
    return res.status(404).render("404Page");
  }

  // post와 연관된 comments도 DB에서 삭제
  const { comments } = post;
  for (const comment of comments) {
    await Comment.findByIdAndDelete(comment._id);
  }

  await Post.findByIdAndDelete(id);
  return res.redirect("/");
});

// POST- 댓글 작성하기
router.post("/posts/:id([0-9a-f]{24})/comments", async (req, res) => {
  const { id } = req.params;
  const { commenter, comment } = req.body;
  const post = await Post.findById(id);

  // 댓글(comment) 내용없이 요청시 에러 메시지 발송
  if (!comment) {
    return res.status(400).render("detailPage", {
      post,
      errorMessage: "댓글 내용을 입력해주세요.",
    });
  }

  // DB에 댓글 등록 중 에러 발생시 try...catch 처리
  try {
    const newComment = await Comment.create({
      commenter,
      comment,
    });

    // 댓글이 달리는 글(post)에 댓글 id 추가
    post.comments.push(newComment._id);
    post.save();

    return res.redirect(`/posts/${id}`);
  } catch (error) {
    return res.status(400).render(`/posts/${id}`, {
      errorMessage: error.message,
    });
  }
});

// GET- 댓글 삭제하기
router.get(
  "/posts/:id([0-9a-f]{24})/:commentId([0-9a-f]{24})/delete",
  async (req, res) => {
    const { id, commentId } = req.params;

    const comment = await Comment.findById(commentId);
    // ID로 조회 실패시 404 페이지 렌더
    if (!comment) {
      return res.status(404).render("404Page");
    }

    const post = await Post.findById(id);
    // ID로 조회 실패시 404 페이지 렌더
    if (!post) {
      return res.status(404).render("404Page");
    }
    // 글(post)에 저장된 댓글(comment) id 삭제
    post.comments.pull(comment._id);
    post.save();

    await Comment.findByIdAndDelete(commentId);

    return res.redirect(`/posts/${id}`);
  }
);

// GET- 댓글 수정하기 (댓글 작성란에 수정하려는 댓글 내용 넣어두기)
router.get(
  "/posts/:id([0-9a-f]{24})/:commentId([0-9a-f]{24})/edit",
  async (req, res) => {
    const { id, commentId } = req.params;

    const comment = await Comment.findById(commentId);
    // ID로 조회 실패시 404 페이지 렌더
    if (!comment) {
      return res.status(404).render("404Page");
    }

    const post = await Post.findById(id).populate("comments");
    // ID로 조회 실패시 404 페이지 렌더
    if (!post) {
      return res.status(404).render("404Page");
    }

    return res.render("detailPage", { post, comment });
  }
);

// POST- 댓글 수정 후 특정 글(post) 조회 페이지로 redirect
router.post(
  "/posts/:id([0-9a-f]{24})/:commentId([0-9a-f]{24})/edit",
  async (req, res) => {
    const { id, commentId } = req.params;
    const { commenter, comment } = req.body;
    const post = await Post.findById(id);

    // 댓글(comment) 내용없이 요청시 에러 메시지 발송
    if (!comment) {
      return res.status(400).render("detailPage", {
        post,
        errorMessage: "댓글 내용을 입력해주세요.",
      });
    }

    const delComment = await Comment.exists({ _id: commentId });
    // ID로 조회 실패시 404 페이지 렌더
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

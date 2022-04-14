import express from "express";
import Post from "../models/Post";
import Comment from "../models/Comment";
import { validatorMiddleware } from "../middlewares/validator";

const postRouter = express.Router();

// GET- 새글 작성 페이지
postRouter.get("/", (req, res) => {
  return res.render("writePage");
});

// POST- 새글 DB에 저장 후 메인 페이지로 redirect
postRouter.post("/", validatorMiddleware, async (req, res) => {
  const { title, author, contents } = req.body;

  // DB에 새글 등록 중 에러 발생시 try...catch 처리
  try {
    await Post.create({
      title,
      author,
      contents,
    });
    return res.redirect("/");
  } catch (error: any) {
    return res.status(400).render("writePage", {
      errorMessage: error.message,
    });
  }
});

// GET- 특정 글 조회 페이지
postRouter.get("/:id([0-9a-f]{24})", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("comments");

  // ID로 조회 실패시 404 페이지 렌더
  if (!post) {
    return res.status(404).render("404Page");
  }

  return res.render("detailPage", { post });
});

// GET- 특정 글 수정 페이지
postRouter.get("/:id([0-9a-f]{24})/edit", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  // ID로 조회 실패시 404 페이지 렌더
  if (!post) {
    return res.status(404).render("404Page");
  }

  return res.render("editPage", { post });
});

// POST- 특정 글 수정 후 해당 글 조회 페이지로 redirect
postRouter.post("/:id([0-9a-f]{24})/edit", async (req, res) => {
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
postRouter.get("/:id([0-9a-f]{24})/delete", async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate("comments");
  // ID로 조회 실패시 404 페이지 렌더
  if (!post) {
    return res.status(404).render("404Page");
  }

  // post와 연관된 comments도 DB에서 삭제
  for (const comment of post.comments) {
    await Comment.findByIdAndDelete(comment._id);
  }

  await Post.findByIdAndDelete(id);
  return res.redirect("/");
});

export default postRouter;

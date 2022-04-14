import express from "express";
import Post from "../models/Post";
import postRouter from "./postRouter";
import commentRouter from "./commentRouter";

const router = express.Router();

// GET- 전체 포스트 조회
router.get("/", async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  return res.render("mainPage", { posts });
});

router.use("/posts", postRouter);
router.use("/posts/:id([0-9a-f]{24})/comments", commentRouter);

export default router;

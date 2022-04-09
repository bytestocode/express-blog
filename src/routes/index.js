const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts");

/*
let posts = [
  {
    id: 1,
    title: "항해99 주특기 1주차",
    author: "노드",
    contents: "재밌어요",
    date: "2022-04-08",
    comments: [],
  },
  {
    id: 2,
    title: "제주도 3박 4일 여행기",
    author: "스프링",
    contents: "신난다",
    date: "2022-04-09",
    comments: [],
  },
  {
    id: 3,
    title: "신입개발자 일상",
    author: "리액트",
    contents: "설렌다",
    date: "2022-04-10",
    comments: [],
  },
];
*/

/*
 * 전체 게시글 조회 => get => /
 * 게시글 작성 => get,post => /newpost
 * 게시글 조회 => get => /posts/:id
 * 게시글 수정 => get,post => /posts/edit/:id
 * 게시글 삭제 => delete => /posts/delete/:id
 *
 * 댓글 목록 조회 => get => /posts/:id/comments (게시글 조회에 포함)
 * 댓글 작성 => post => /posts/:id/comments (게시글 조회시 댓글창 포함)
 * 댓글 수정 => post => /posts/:id/comments/edit/:commentId
 * 댓글 삭제 => delete => /posts/:id/comments/delete/:commentId
 *
 */

router.get("/", async (req, res) => {
  const posts = await Posts.find({});
  const reverse_posts = posts.reverse();
  return res.render("main", { posts: reverse_posts });
});

router.get("/newpost", (req, res) => {
  return res.render("newpost");
});

router.post("/newpost", async (req, res) => {
  const { title, author, contents } = req.body;

  await Posts.create({
    title,
    author,
    contents,
    date: new Date(),
    comments: [],
  });

  return res.redirect("/");
});

router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id);
  return res.render("read", { post });
});

router.get("/posts/edit/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id);
  return res.render("edit", { post });
});

router.post("/posts/edit/:id", async (req, res) => {
  const { title, author, contents } = req.body;
  const { id } = req.params;
  await Posts.findByIdAndUpdate(id, { $set: { title, author, contents } });
  return res.redirect(`/posts/${id}`);
});

router.get("/posts/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Posts.findByIdAndDelete(id);
  return res.redirect("/");
});

router.post("/posts/:id/newcomments", async (req, res) => {
  const { id } = req.params;
  const { author, contents } = req.body;
  const commentId = Date.now() - 1649400000000;

  await Posts.findByIdAndUpdate(id, {
    $push: { comments: { commentId, author, contents } },
  });
  return res.redirect(`/posts/${id}`);
});

router.get("/posts/:id/:commentId/delete", async (req, res) => {
  const { id, commentId } = req.params;
  const post = await Posts.findById(id);
  const comment = post.comments.find((comment) => {
    return comment.commentId === +commentId;
  });
  await post.updateOne({
    $pull: { comments: comment },
  });
  return res.redirect(`/posts/${id}`);
});

router.get("/posts/:id/:commentId/edit", async (req, res) => {
  const { id, commentId } = req.params;
  const post = await Posts.findById(id);
  const comment = post.comments.find((comment) => {
    return comment.commentId === +commentId;
  });
  return res.render("read", { post, comment });
});

router.post("/posts/:id/:commentId/edit", async (req, res) => {
  const { id, commentId } = req.params;
  const { author, contents } = req.body;

  const post = await Posts.findById(id);
  const comments = post.comments.map((comment) => {
    if (comment.commentId === +commentId) {
      return { commentId: +commentId, author, contents };
    } else {
      return comment;
    }
  });

  await post.updateOne({ $set: { comments } });

  return res.redirect(`/posts/${id}`);
});

module.exports = router;

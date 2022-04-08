const express = require("express");
const router = express.Router();

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

router.get("/", (req, res) => {
  return res.render("main", { posts: posts.reverse() });
});

router.get("/newpost", (req, res) => {
  return res.render("newpost");
});

router.post("/newpost", (req, res) => {
  const { title, author, contents } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    author,
    contents,
    date: new Date(),
    comments: [],
  };
  posts.push(newPost);
  return res.redirect("/");
});

router.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((post) => post.id === +id);
  return res.render("read", { post });
});

router.get("/posts/edit/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((post) => post.id === +id);
  return res.render("edit", { post });
});

router.post("/posts/edit/:id", (req, res) => {
  const { title, contents } = req.body;
  const { id } = req.params;
  posts = posts.map((post) => {
    if (post.id === +id) {
      return { ...post, title, contents };
    } else {
      return post;
    }
  });
  return res.redirect(`/posts/${id}`);
});

router.get("/posts/delete/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((post) => post.id !== +id);
  return res.redirect("/");
});

module.exports = router;

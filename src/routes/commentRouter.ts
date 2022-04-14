import express, { Request, Response } from "express";
import Post from "../models/Post";
import Comment from "../models/Comment";

const commentRouter = express.Router({ mergeParams: true });

// POST- 댓글 작성하기
commentRouter.post("/", async (req: Request, res: Response) => {
  // TODO: TS2339: Property 'id' does not exist on type '{}'.
  // req에 Request 타입 적용해서 해결
  const { id } = req.params;
  const { commenter, comment } = req.body;
  const post = await Post.findById(id);
  // ID로 조회 실패시 404 페이지 렌더
  if (!post) {
    return res.status(404).render("404Page");
  }

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
  } catch (error: any) {
    return res.status(400).render(`/posts/${id}`, {
      errorMessage: error.message,
    });
  }
});

// GET- 댓글 삭제하기
commentRouter.get("/:commentId([0-9a-f]{24})/delete", async (req, res) => {
  const { id, commentId } = req.params;

  const comment = await Comment.findById(commentId);
  // ID로 조회 실패시 404 페이지 렌더
  if (!comment) {
    return res.status(404).render("404Page");
  }

  // 글(post)에 저장된 댓글(comment) id 삭제
  // pull이 타입에러 나서 고친 코드
  await Post.findByIdAndUpdate(id, {
    $pull: { comments: { _id: comment._id } },
  });

  // // 아래는 타입스크립트 에러 코드...
  // const post = await Post.findById(id);
  // // ID로 조회 실패시 404 페이지 렌더
  // if (!post) return res.status(404).render("404Page");
  //
  // // TODO: TS2339: Property 'pull' does not exist on type 'ObjectId[]'.
  // // push는 되는데(line 38) pull 안되는 이유?
  // post.comments.pull(comment._id);
  // post.save();

  await Comment.findByIdAndDelete(commentId);

  return res.redirect(`/posts/${id}`);
});

// GET- 댓글 수정하기 (댓글 작성란에 수정하려는 댓글 내용 넣어두기)
commentRouter.get("/:commentId([0-9a-f]{24})/edit", async (req, res) => {
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
});

// POST- 댓글 수정 후 특정 글(post) 조회 페이지로 redirect
commentRouter.post("/:commentId([0-9a-f]{24})/edit", async (req, res) => {
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
});

export default commentRouter;

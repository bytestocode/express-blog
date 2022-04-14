import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// 새 글(post) 저장하기 전에 제목, 작성자, 내용의 형식을 검증하는 미들웨어
export const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postSchema = Joi.object({
    title: Joi.string().min(4).max(16).required(),
    author: Joi.string().min(4).max(16).required(),
    contents: Joi.string().min(4).max(70).required(),
  });

  const options = {
    abortEarly: false,
  };

  const { error, value } = postSchema.validate(req.body, options);

  if (error) {
    return res.status(400).send({ message: error.message });
  } else {
    req.body = value;
    next();
  }
};

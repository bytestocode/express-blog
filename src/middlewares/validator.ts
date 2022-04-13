import { Request, Response, NextFunction } from "express";
import Joi from "joi";

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

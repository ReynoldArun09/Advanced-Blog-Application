import { type Request, type Response } from "express";
import { ApiSuccessMessages, HttpStatusCode } from "../constants";
import { prisma } from "../lib/prisma";
import { initializeRedisClient } from "../lib/redis";
import { AsyncWrapper, getKeyName } from "../utils";

export const GetAllCommentApi = AsyncWrapper(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const client = await initializeRedisClient();
  const cacheKey = getKeyName("comments", "post", `${postId}`);

  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    return res.status(HttpStatusCode.OK).json(JSON.parse(cachedData));
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  await client.setEx(cacheKey, 300, JSON.stringify(comments));

  res.status(HttpStatusCode.OK).json({
    success: true,
    data: comments,
  });
});

export const CreateCommentApi = AsyncWrapper(async (req: Request, res: Response) => {
  const { comment, postId } = req.body;
  const userId = req.ctx?.id;

  const newComment = await prisma.comment.create({
    data: {
      comment,
      postId,
      userId,
    },
  });

  await prisma.post.update({
    where: { id: postId },
    data: { comments: { connect: { id: newComment.id } } },
  });

  const client = await initializeRedisClient();
  const cacheKey = getKeyName("comments", "post", `${postId}`);
  await client.del(cacheKey);

  res.status(HttpStatusCode.CREATED).json({
    success: true,
    message: ApiSuccessMessages.COMMENT_CREATED,
  });
});

export const DeleteCommentApi = AsyncWrapper(async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;

  await prisma.post.update({
    where: { id: postId },
    data: { comments: { disconnect: { id: commentId } } },
  });

  await prisma.comment.delete({ where: { id: commentId } });

  const client = await initializeRedisClient();
  const cacheKey = getKeyName("comments", "post", `${postId}`);
  await client.del(cacheKey);

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ApiSuccessMessages.COMMENT_DELETED,
  });
});

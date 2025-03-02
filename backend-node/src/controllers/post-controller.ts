import { type Request, type Response } from "express";
import { v4 } from "uuid";
import { ApiErrorMessages, ApiSuccessMessages, HttpStatusCode } from "../constants";
import { prisma } from "../lib/prisma";
import { initializeRedisClient } from "../lib/redis";
import { PostSchema } from "../schemas/post-schema";
import { AppError, AsyncWrapper, getKeyName } from "../utils";
import { deleteObject, putObject } from "../utils/s3";

export const GetAllBlogPostApi = AsyncWrapper(async (req: Request, res: Response) => {
  const { page = 1, limit = 5 } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const client = await initializeRedisClient();
  const cacheKey = getKeyName("posts", `page:${pageNum}`, `limit:${limitNum}`);
  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    return res.status(HttpStatusCode.OK).json(JSON.parse(cachedData));
  }

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limitNum,
  });
  const totalPost = await prisma?.post.count();
  const hasMore = pageNum * limitNum < totalPost;

  const response = {
    data: posts,
    hasMore,
    nextPage: hasMore ? pageNum + 1 : null,
  };

  await client.setEx(cacheKey, 300, JSON.stringify(response));

  res.status(HttpStatusCode.OK).json(response);
});

export const GetRecentBlogPostApi = AsyncWrapper(async (req: Request, res: Response) => {
  const client = await initializeRedisClient();
  const cacheKey = getKeyName("recent-blogs");
  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    return res.status(HttpStatusCode.OK).json(JSON.parse(cachedData));
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  await client.setEx(cacheKey, 300, JSON.stringify(posts));

  res.status(HttpStatusCode.OK).json({
    success: true,
    data: posts,
  });
});

export const SinglePostApi = AsyncWrapper(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const client = await initializeRedisClient();
  const cacheKey = getKeyName("single-post", postId);
  const cachedData = await client.get(cacheKey);
  if (cachedData) {
    return res.status(HttpStatusCode.OK).json(JSON.parse(cachedData));
  }

  const existingPost = await prisma.post.findUnique({ where: { id: postId } });

  if (!existingPost) {
    throw new AppError(ApiErrorMessages.POST_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
  }
  await client.setEx(cacheKey, 600, JSON.stringify(existingPost));

  res.status(HttpStatusCode.OK).json({
    success: true,
    data: existingPost,
  });
});

export const CreatePostApi = AsyncWrapper(async (req: Request, res: Response) => {
  const { title, description } = PostSchema.parse(req.body);
  const { file } = req.files as any;
  const imageName = "blogs/" + v4();
  const userId = req.ctx.id;
  const existingPost = await prisma.post.findFirst({
    where: {
      title,
    },
  });

  if (existingPost) {
    throw new AppError(ApiErrorMessages.POST_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
  }

  const result = await putObject(file.data, imageName);

  if (!result || !result.url || !result.key) {
    throw new AppError(ApiErrorMessages.INVALID_TOKEN, HttpStatusCode.BAD_REQUEST);
  }

  const { url, key } = result;

  await prisma.post.create({
    data: {
      title,
      description,
      image: `${url},${key}`,
      userId,
    },
  });

  const client = await initializeRedisClient();
  const RecentBlogsCacheKey = getKeyName("recent-blogs");
  const AllBlogsCacheKey = getKeyName("posts");
  await client.del(RecentBlogsCacheKey);
  await client.del(AllBlogsCacheKey); // need to fix this

  res.status(HttpStatusCode.CREATED).json({
    success: true,
    message: ApiSuccessMessages.POST_CREATED,
  });
});

export const DeletePostApi = AsyncWrapper(async (req: Request, res: Response) => {
  const postId = req.params.id;

  const existingPost = await prisma.post.findUnique({ where: { id: postId } });

  if (!existingPost) {
    throw new AppError(ApiErrorMessages.POST_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
  }

  if (existingPost.image) {
    await deleteObject(existingPost.image);
  }

  const result = await prisma.$transaction([
    prisma.post.delete({ where: { id: postId } }),
    prisma.comment.deleteMany({ where: { id: postId } }),
  ]);

  const client = await initializeRedisClient();
  const RecentBlogsCacheKey = getKeyName("recent-blogs");
  const PostIdcacheKey = getKeyName("single-post", postId);
  await Promise.all([client.del(PostIdcacheKey), client.del(RecentBlogsCacheKey)]);

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ApiSuccessMessages.POST_DELETED,
  });
});

export const SearchPostApi = AsyncWrapper(async (req: Request, res: Response) => {
  const search = req.params.searchTerm;
  const regex = new RegExp(search, "i");
  const client = await initializeRedisClient();
  const cacheKey = getKeyName("search", `${search}`);
  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    return res.status(HttpStatusCode.OK).json(JSON.parse(cachedData));
  }

  const findPosts = await prisma.post.findMany({
    where: { title: { contains: search, mode: "insensitive" } },
  });

  await client.setEx(cacheKey, 300, JSON.stringify(findPosts));

  res.status(HttpStatusCode.OK).json({
    success: true,
    data: findPosts,
  });
});

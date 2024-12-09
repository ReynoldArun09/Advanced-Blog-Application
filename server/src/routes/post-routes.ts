import { Router } from "express";
import * as post from '../controllers/post-controller'
import { AuthMiddleware, ValidationMiddleware } from "../middlewares";
import { PostSchema } from "../schemas/post-schema";

const postRoutes = Router()

postRoutes.post("/create-post", ValidationMiddleware(PostSchema), AuthMiddleware, post.CreatePostApi)
postRoutes.get("/single-post/:id", post.SinglePostApi)
postRoutes.delete("/delete-post/:id", post.DeletePostApi)
postRoutes.get("/search-post/:searchTerm", post.SearchPostApi)

export default postRoutes

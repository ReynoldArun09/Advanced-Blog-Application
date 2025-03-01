import { Router } from "express";
import * as post from "../controllers/post-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";

const postRoutes = Router();

postRoutes.get("/all-posts", post.GetAllBlogPostApi);
postRoutes.get("/recent-posts", post.GetRecentBlogPostApi);
postRoutes.post("/create-post", AuthMiddleware, post.CreatePostApi);
postRoutes.get("/single-post/:id", post.SinglePostApi);
postRoutes.delete("/delete-post/:id", post.DeletePostApi);
postRoutes.get("/search-post/:searchTerm", post.SearchPostApi);

export default postRoutes;

import { Router } from "express";
import * as comment from "../controllers/comment-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";

const commentRoutes = Router();

commentRoutes.get("/all-comments/:postId", comment.GetAllCommentApi);
commentRoutes.post("/create-comment", AuthMiddleware, comment.CreateCommentApi);
commentRoutes.delete("/delete-comment/:postId/:commentId", comment.DeleteCommentApi);

export default commentRoutes;

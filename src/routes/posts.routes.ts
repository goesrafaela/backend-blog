import { Router } from "express";
import {
    createPost,
    deletePost,
    getPostById,
    listPosts,
    updatePost,
} from "../controllers/posts.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadConfig } from "../config/multer";

const postsRoutes = Router();

postsRoutes.get("/", listPosts);
postsRoutes.get("/:id", getPostById);

// Protected routes
postsRoutes.post(
    "/",
    authMiddleware,
    uploadConfig.single("banner"),
    createPost
);

postsRoutes.put("/:id", authMiddleware, updatePost);
postsRoutes.delete("/:id", authMiddleware, deletePost);

export default postsRoutes;

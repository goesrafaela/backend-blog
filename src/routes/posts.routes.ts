import { Router } from "express";
import {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getMyPosts,
} from "../controllers/posts.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadConfig } from "../config/multer";

const postsRoutes = Router();

// públicas
postsRoutes.get("/", getAllPosts);

// privadas 
postsRoutes.get("/me", authMiddleware, getMyPosts);

// públicas
postsRoutes.get("/:id", getPostById);

// privadas
postsRoutes.post("/", authMiddleware, uploadConfig.single("banner"), createPost);

postsRoutes.put("/:id", authMiddleware, uploadConfig.single("banner"), updatePost);

postsRoutes.delete("/:id", authMiddleware, deletePost);

export default postsRoutes;

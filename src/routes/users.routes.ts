import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMe } from "../controllers/users.controller";

const usersRoutes = Router();

usersRoutes.get("/me", authMiddleware, getMe);

export default usersRoutes;

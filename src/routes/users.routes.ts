import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMe, updateMe, updatePassword } from "../controllers/users.controller";

const usersRoutes = Router();

usersRoutes.get("/me", authMiddleware, getMe);
usersRoutes.put("/me", authMiddleware, updateMe);
usersRoutes.put("/me/password", authMiddleware, updatePassword);

export default usersRoutes;

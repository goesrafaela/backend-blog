import { Router } from "express";
import authRoutes from "./auth.routes";
import postsRoutes from "./posts.routes";

const routes = Router();

routes.get("/health", (req, res) => {
    return res.json({ status: "ok" });
});

routes.use("/auth", authRoutes);
routes.use("/posts", postsRoutes);

export default routes;

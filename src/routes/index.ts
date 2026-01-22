import { Router } from "express";
import { db } from "../database/connection";
import authRoutes from "./auth.routes";
import postsRoutes from "./posts.routes";


const routes = Router();

routes.get("/health", async (req, res) => {
    try {
        await db.query("SELECT 1");
        return res.json({ status: "ok", database: "connected" });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            database: "disconnected",
        });
    }
});

// prefixo /autenticação
routes.use("/auth", authRoutes);
routes.use("/posts", postsRoutes);

export default routes;

import { Request, Response } from "express";
import { db } from "../database/connection";

// GET /posts (público)
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const [posts] = await db.query<any[]>(
            `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.banner_image AS banner,
        p.publish_at,
        p.updated_at,
        u.id AS author_id,
        u.name AS author_name
      FROM posts p
      INNER JOIN users u ON u.id = p.author_id
      ORDER BY p.publish_at DESC
      `
        );

        return res.json(posts);
    } catch (error) {
        console.error("GET POSTS ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// GET /posts/:id (público)
export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query<any[]>(
            `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.banner_image AS banner,
        p.publish_at,
        p.updated_at,
        u.id AS author_id,
        u.name AS author_name
      FROM posts p
      INNER JOIN users u ON u.id = p.author_id
      WHERE p.id = ?
      LIMIT 1
      `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error("GET POST BY ID ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// POST /posts (privado)
export const createPost = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { title, content } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!title || !content) {
            return res.status(400).json({ message: "title and content are required" });
        }

        const bannerFile = req.file;
        const bannerImage = bannerFile ? bannerFile.filename : null;

        const [result] = await db.query<any>(
            `
  INSERT INTO posts (title, content, banner_image, author_id, updated_at)
  VALUES (?, ?, ?, ?, NOW())
  `,
            [title, content, bannerImage, userId]
        );

        return res.status(201).json({
            message: "Post created successfully",
            postId: result.insertId,
        });
    } catch (error) {
        console.error("CREATE POST ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// PUT /posts/:id (privado - somente autor)
export const updatePost = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { title, content } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // verifica se existe e se é do autor
        const [rows] = await db.query<any[]>(
            "SELECT id, author_id FROM posts WHERE id = ? LIMIT 1",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        const post = rows[0];

        if (post.author_id !== userId) {
            return res.status(403).json({ message: "You cannot edit this post" });
        }

        const bannerFile = req.file;
        const newBannerImage = bannerFile ? bannerFile.filename : null;

        await db.query(
            `
      UPDATE posts
      SET 
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        banner_image = COALESCE(?, banner_image),
        updated_at = NOW()
      WHERE id = ?
      `,
            [title ?? null, content ?? null, newBannerImage, id]
        );

        return res.json({ message: "Post updated successfully" });
    } catch (error) {
        console.error("UPDATE POST ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE /posts/:id (privado - somente autor)
export const deletePost = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const [rows] = await db.query<any[]>(
            "SELECT id, author_id FROM posts WHERE id = ? LIMIT 1",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        const post = rows[0];

        if (post.author_id !== userId) {
            return res.status(403).json({ message: "You cannot delete this post" });
        }

        await db.query("DELETE FROM posts WHERE id = ?", [id]);

        return res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("DELETE POST ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

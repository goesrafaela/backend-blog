import { Request, Response } from "express";
import { db } from "../database/connection";

export async function listPosts(req: Request, res: Response) {
    const [posts] = await db.query<any[]>(
        `
    SELECT 
      p.id,
      p.title,
      p.content,
      p.banner_image,
      p.published_at,
      p.updated_at,
      u.id as author_id,
      u.name as author_name,
      u.email as author_email
    FROM posts p
    INNER JOIN users u ON u.id = p.author_id
    ORDER BY p.published_at DESC
    `
    );

    return res.json(posts);
}

export async function getPostById(req: Request, res: Response) {
    const { id } = req.params;

    const [posts] = await db.query<any[]>(
        `
    SELECT 
      p.id,
      p.title,
      p.content,
      p.banner_image,
      p.published_at,
      p.updated_at,
      u.id as author_id,
      u.name as author_name,
      u.email as author_email
    FROM posts p
    INNER JOIN users u ON u.id = p.author_id
    WHERE p.id = ?
    LIMIT 1
    `,
        [id]
    );

    if (posts.length === 0) {
        return res.status(404).json({ message: "Post not found" });
    }

    return res.json(posts[0]);
}

export async function createPost(req: Request, res: Response) {
    const { title, content } = req.body;

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    const bannerImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query<any>(
        `
    INSERT INTO posts (title, content, banner_image, author_id, published_at)
    VALUES (?, ?, ?, ?, NOW())
    `,
        [title, content, bannerImagePath, req.userId]
    );

    return res.status(201).json({
        message: "Post created successfully",
        postId: result.insertId,
    });
}

export async function updatePost(req: Request, res: Response) {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const [posts] = await db.query<any[]>(
        "SELECT id, author_id FROM posts WHERE id = ? LIMIT 1",
        [id]
    );

    if (posts.length === 0) {
        return res.status(404).json({ message: "Post not found" });
    }

    const post = posts[0];

    if (post.author_id !== req.userId) {
        return res.status(403).json({ message: "You cannot edit this post" });
    }

    await db.query(
        `
    UPDATE posts
    SET title = ?, content = ?, updated_at = NOW()
    WHERE id = ?
    `,
        [title, content, id]
    );

    return res.json({ message: "Post updated successfully" });
}

export async function deletePost(req: Request, res: Response) {
    const { id } = req.params;

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const [posts] = await db.query<any[]>(
        "SELECT id, author_id FROM posts WHERE id = ? LIMIT 1",
        [id]
    );

    if (posts.length === 0) {
        return res.status(404).json({ message: "Post not found" });
    }

    const post = posts[0];

    if (post.author_id !== req.userId) {
        return res.status(403).json({ message: "You cannot delete this post" });
    }

    await db.query("DELETE FROM posts WHERE id = ?", [id]);

    return res.json({ message: "Post deleted successfully" });
}

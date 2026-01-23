import { Request, Response } from "express";
import { db } from "../database/connection";
import bcrypt from "bcrypt";

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const [rows] = await db.query<any[]>(
            `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error("GET ME ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateMe = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { name, email } = req.body as { name?: string; email?: string };

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!name && !email) {
            return res.status(400).json({ message: "name or email is required" });
        }

        // se vier email, checa duplicidade (outro usuário)
        if (email) {
            const [emailRows] = await db.query<any[]>(
                `SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1`,
                [email, userId]
            );

            if (emailRows.length > 0) {
                return res.status(409).json({ message: "Email already in use" });
            }
        }

        await db.query(
            `
      UPDATE users
      SET
        name = COALESCE(?, name),
        email = COALESCE(?, email)
      WHERE id = ?
      `,
            [name ?? null, email ?? null, userId]
        );

        const [rows] = await db.query<any[]>(
            `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
            [userId]
        );

        return res.json({ message: "Profile updated", user: rows[0] });
    } catch (error) {
        console.error("UPDATE ME ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { password } = req.body as { password?: string };

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!password || password.trim().length < 6) {
            return res
                .status(400)
                .json({ message: "password must be at least 6 characters" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await db.query(
            `
      UPDATE users
      SET password_hash = ?
      WHERE id = ?
      `,
            [passwordHash, userId]
        );

        return res.json({ message: "Password updated" });
    } catch (error) {
        console.error("UPDATE PASSWORD ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

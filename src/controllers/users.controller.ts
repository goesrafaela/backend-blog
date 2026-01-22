import { Request, Response } from "express";
import { db } from "../database/connection";

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

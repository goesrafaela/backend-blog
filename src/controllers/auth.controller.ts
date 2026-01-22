import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../database/connection";

export async function register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }

    const [existing] = await db.query<any[]>(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (existing.length > 0) {
        return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query<any>(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash]
    );

    return res.status(201).json({
        message: "User created successfully",
        user: {
            id: result.insertId,
            name,
            email,
        },
    });
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const [users] = await db.query<any[]>(
        "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (users.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    return res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
}

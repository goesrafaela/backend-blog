import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("GLOBAL ERROR:", err);

    return res.status(500).json({
        message: "Internal server error",
    });
};

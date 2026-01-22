//Tipagem para o req.userId

declare namespace Express {
    export interface Request {
        userId?: number;
    }
}

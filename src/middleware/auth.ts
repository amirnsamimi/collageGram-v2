import type {NextFunction, Request, Response} from 'express';
import {verifyJWTToken, type JwtPayload} from "../utils/tokens.ts";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({error: 'bad request'})
        }
        req.user = await verifyJWTToken(token)
        next()
    } catch (e) {
        console.log(e)
        res.status(403).json({error: 'Forbidden'})
    }
}
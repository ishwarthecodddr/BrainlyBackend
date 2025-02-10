import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

interface JwtPayload {
    id: string;
}
export const Usermiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ error: 'Authorization header missing' });
            return;
        }

        // if (!authHeader.startsWith('Bearer ')) {
        //     res.status(401).json({ error: 'Invalid token format' });
        //     return;
        // }
        // const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(authHeader, JWT_SECRET) as JwtPayload;
            req.userId = decoded.id;
            next();
        } catch (jwtError) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
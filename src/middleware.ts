import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from './shared/config';

interface ErrorResponse {
    message: string;
    status: number;
}

export function errorHandler(err: ErrorResponse, req: Request, res: Response, next: NextFunction) {
    res.status(err.status).json({ message: err.message });
}

// express middleware function that decodes the bearer token
export function requireLogin(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return next({ status: 401, message: 'No authentication header' });

    const token = authHeader.split(' ')[1];
    if (!token)
        return next({ status: 401, message: 'No token provided' });

    jwt.verify(token, config.jwtSecret, (err, decoded: any) => {
        if (err)
            return next({ status: 401, message: 'Token invalid' });

        req.discordId = decoded.discordId;
        next();
    });
}
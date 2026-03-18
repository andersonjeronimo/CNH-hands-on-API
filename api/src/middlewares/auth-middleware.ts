import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import authRepository from '../repositories/auth-repository';
import jwt from "jsonwebtoken";

type JwtPayload = {
    id: string
}

export const authMiddleware = async function verifyAuth(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.sendStatus(401);
    } else {
        const token = authorization.split(' ')[1];
        const { id } = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
        const authUser = await authRepository.findUser(id);

        if (!authUser) {
            res.sendStatus(401);
        } else {
            const { password: _, ...user } = authUser;
            req.user = user;
            next();
        }
    }    
}
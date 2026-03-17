import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

import authRepository from '../repositories/auth-repository';
import jwt from "jsonwebtoken";

type JwtPayload = {
    id: string
}

async function verifyAuth(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.split(' ')[1];
        const { id } = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
        const _authUser = await authRepository.findUserById(id);

        if (_authUser) {
            const { password: _, ...authUser } = _authUser;
            //setar o authUser na req.
            next();
        }
        else {
            res.sendStatus(401);
        }

    } else {
        res.sendStatus(401);
    }
}




export default { verifyAuth }
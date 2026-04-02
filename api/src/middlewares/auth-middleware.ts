import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import authRepository from '../repositories/auth-repository';
import jwt from "jsonwebtoken";

import { JwtPayload } from '../utils/utils';

async function hasJwt(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(200).json({
            status: 404,
            success: false,
            message: "Unauthorized, No auth token found",
        });
    }

    next();
}

async function isAuthorized(req: Request, res: Response, next: NextFunction) {

    const JWT_SECRET = `${process.env.JWT_SECRET}`;

    if (!JWT_SECRET) {
        res.status(200).json({
            status: 401,
            success: false,
            message: "Unauthorized, Something went wrong",
            timestamp: new Date().toISOString()
        });
    }
    const { authorization } = req.headers;
    const token = authorization ? authorization.split(' ')[1] : '';
    const { id, exp } = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

    if (Date.now() / 1000 > exp) {
        res.status(200).json({
            status: 401,
            success: false,
            message: "Unauthorized, Token expired",
            timestamp: new Date().toISOString()
        });
    }

    const isAuthenticUser = await authRepository.findUser(id);
    if (!isAuthenticUser) {
        res.status(200).json({
            status: 401,
            success: false,
            message: "Unauthorized, No user matched",
            timestamp: new Date().toISOString()
        });
    } else {
        const { password: _, ...user } = isAuthenticUser;
        req.user = user;
        next();
    }
}

export default { hasJwt, isAuthorized };
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User, JwtPayload } from "../utils/utils";
import authRepository from '../repositories/auth-repository';

async function create(req: Request, res: Response, next: NextFunction) {
    const user = req.body;
    const userExists = await authRepository.auth(user.email);
    if (userExists) {
        var creationDate = userExists._id.getTimestamp();
        res.status(200).json({
            status: 409,
            success: false,
            message: "Unauthorized, User already registered",
            timestamp: creationDate.toISOString()
        });
    } else {
        const hashPassword = await bcrypt.hash(user.password, 8);
        user.password = hashPassword;
        const insertedId = await authRepository.create(user);
        var creationDate = insertedId.getTimestamp();
        res.status(200).json({
            status: 201,
            success: true,
            message: "User created",
            result: insertedId,
            timestamp: creationDate.toISOString()
        });
    }
}

async function findUser(req: Request, res: Response, next: NextFunction) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await authRepository.findUser(id);
    var creationDate = result ? result._id.getTimestamp() : new Date();
    res.status(200).json({
        status: result ? 200 : 404,
        success: result ? true : false,
        message: result ? "User found" : "User not found",
        user: result,
        timestamp: creationDate.toISOString()
    });
}

//login
async function auth(req: Request, res: Response, next: NextFunction) {
    const user = req.body as User;
    const _authUser = await authRepository.auth(user.email);
    if (_authUser) {
        const verifyPass = await bcrypt.compare(user.password, _authUser.password);
        if (!verifyPass) {
            res.status(200).json({
                status: 401,
                success: false,
                message: "Unauthorized, No user matched",
                timestamp: new Date().toISOString()
            });
        }
        const token = jwt.sign({ id: _authUser._id }, `${process.env.JWT_SECRET}`, { expiresIn: Number(process.env.JWT_EXPIRES) });
        const { password: _, ...authUser } = _authUser;

        var creationDate = authUser._id.getTimestamp();
        res.status(200).json({
            status: 200,
            user: authUser,
            token: token,
            success: true,
            message: "Authorized, User matched",
            timestamp: creationDate.toISOString()
        });

    } else {
        res.status(200).json({
            status: 401,
            success: false,
            message: "Unauthorized, No user matched",
            timestamp: new Date().toISOString()
        });
    }
}

//verifica se sessão expirou
async function session(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    const JWT_SECRET = `${process.env.JWT_SECRET}`;
    const { authorization } = req.headers;
    const token = authorization ? authorization.split(' ')[1] : '';
    const { id, exp } = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

    if (!JWT_SECRET) {
        res.status(200).json({
            status: 401,
            success: false,
            message: "Unauthorized, Something went wrong",
            timestamp: new Date().toISOString()
        });

    } else if (Date.now() / 1000 > exp) {
        res.status(200).json({
            status: 401,
            success: false,
            message: "Unauthorized, Token expired",
            timestamp: new Date().toISOString()
        });

    } else if (id !== body.id) {
        res.status(200).json({
            status: 401,
            success: false,
            message: "Unauthorized, No user matched",
            timestamp: new Date().toISOString()
        });
    } else {

        res.status(200).json({
            status: 200,
            success: true,
            message: "Authorized, Valid token, Token and user matched",
            timestamp: new Date().toISOString()
        });

    }

}



export default { create, auth, findUser, session }
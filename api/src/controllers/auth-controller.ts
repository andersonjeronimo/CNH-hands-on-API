import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from '../models/user';
import authRepository from '../repositories/auth-repository';

async function create(req: Request, res: Response, next: NextFunction) {
    const user = req.body;
    const userExists = await authRepository.auth(user.email);
    if (userExists) {
        res.send(200).json({
            status: 409,
            success: false,
            message: "Unauthorized, User already registered",
            timestamp: new Date().toISOString()
        });
    } else {
        const hashPassword = await bcrypt.hash(user.password, 8);
        user.password = hashPassword;
        const insertedId = await authRepository.create(user);
        res.status(201).json({
            status: 201,
            success: true,
            message: "User created",
            result: insertedId,
            timestamp: new Date().toISOString()
        });
    }
}

async function findUser(req: Request, res: Response, next: NextFunction) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await authRepository.findUser(id);
    res.status(200).json({
        status: 200,
        success: true,
        message: "User found",
        user: result,
        timestamp: new Date().toISOString()
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

        res.status(200).json({
            status: 200,
            user: authUser,
            token: token,
            success: true,
            message: "Authorized, User matched",
            timestamp: new Date().toISOString()
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

export default { create, auth, findUser }
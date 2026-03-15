import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from 'src/models/user';
import authRepository from '../repositories/auth-repository';

async function create(req: Request, res: Response, next: NextFunction) {
    const user = req.body as User;
    const userExists = await authRepository.auth(user.email);
    if (userExists) {
        res.sendStatus(409);
    } else {
        const hashPassword = await bcrypt.hash(user.password, 8);
        user.password = hashPassword;
        const insertedId = await authRepository.create(user);
        res.status(201).json(insertedId);
    }
}

async function auth(req: Request, res: Response, next: NextFunction) {
    const user = req.body as User;
    const authUser = await authRepository.auth(user.email);
    if (authUser) {
        const _authUser = authUser.toArray();
        const verifyPass = await bcrypt.compare(user.password, _authUser.password);

        console.log(verifyPass);
        
        if (!verifyPass) {
            res.sendStatus(400);
        }

        const token = jwt.sign({ id: authUser._id }, `${process.env.JWT_PASS}`, { expiresIn: '8h' });

        console.log(token);

    } else {
        res.sendStatus(404);
    }
}

export default { create, auth }
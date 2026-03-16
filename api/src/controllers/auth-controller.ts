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

async function findUserById(req: Request, res: Response, next: NextFunction) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const _user = await authRepository.findUserById(id);
    if (_user) {
        const { password: _, ...user } = _user;
        res.status(200).json(user);
    } else {
        res.sendStatus(404);
    }

}

async function auth(req: Request, res: Response, next: NextFunction) {
    const user = req.body as User;
    const _authUser = await authRepository.auth(user.email);
    if (_authUser) {
        const verifyPass = await bcrypt.compare(user.password, _authUser.password);
        if (!verifyPass) {
            res.sendStatus(400);
        }

        const token = jwt.sign({ id: _authUser._id }, `${process.env.JWT_SECRET}`, { expiresIn: '8h' });

        const { password: _, ...authUser } = _authUser;

        res.status(200).json({
            user: authUser,
            token: token
        });

    } else {
        res.sendStatus(404);
    }
}

export default { create, auth, findUserById }
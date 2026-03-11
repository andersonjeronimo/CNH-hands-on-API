import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

import authRepository from '../repositories/auth-repository';

async function doLogin(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const response = await authRepository.auth(username, password);
    res.status(200).json(response);
}

export default { doLogin }
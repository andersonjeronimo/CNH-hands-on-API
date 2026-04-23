import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

import { Mail } from '../utils/utils'
import service from '../services/nodemailer-service'

async function sendMail(req: Request, res: Response, next: NextFunction) {
    const mail = req.body as Mail;
    mail.from = process.env.MAIL_FROM ?? '';
    
    const sent = await service.sendMail(mail);

    res.status(200).json({
        status:  200,
        success: true,
        message: "Mail sent",
        result : sent,
        timestamp: new Date().toISOString()
    });

}

export default { sendMail }
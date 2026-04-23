import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

import { CloudinaryImage } from '../utils/utils'
import service from '../services/cloudinary-service'

async function cloudinarySignature(req: Request, res: Response, next: NextFunction) {
    const image = req.body as CloudinaryImage;
    
    const promise = await service.getSignature(image)

    res.status(200).json({
        status: 201,
        success: true,
        message: "Signature created",
        signature: promise.signature,
        timestamp: promise.timestamp
    });

}

export default { cloudinarySignature }
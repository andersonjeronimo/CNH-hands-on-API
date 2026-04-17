import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

import { CloudinaryImage } from '../utils/utils'

async function cloudinarySignature(req: Request, res: Response, next: NextFunction) {
    const image = req.body as CloudinaryImage;

    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
        cloud_name: `${process.env.CLOUDINARY_NAME}`,
        api_key: `${process.env.CLOUDINARY_API_KEY}`,
        api_secret: `${process.env.CLOUDINARY_API_SECRET}`, // Essential for signature generation
        upload_preset: `${process.env.CLOUDINARY_PRESET}` 
    });

    //const timestamp = Math.floor((new Date()).getTime() / 1000)
    const params_to_sign = {
        timestamp: image.timestamp, // Current Unix timestamp
        public_id: image.public_id,
        folder: image.asset_folder
    };    

    const signature = cloudinary.utils.api_sign_request(
        params_to_sign,
        `${process.env.CLOUDINARY_API_SECRET}`        
    );   

    res.status(200).json({
        status: 201,
        success: true,
        message: "Signature created",
        signature: signature,
        timestamp: image.timestamp
    });

}

export default { cloudinarySignature }
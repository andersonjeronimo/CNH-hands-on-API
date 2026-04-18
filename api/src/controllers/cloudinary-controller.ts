import dotenv from 'dotenv';
dotenv.config();

//const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary } from 'cloudinary';

import { Request, Response, NextFunction } from 'express';

import { CloudinaryImage } from '../utils/utils'

async function cloudinarySignature(req: Request, res: Response, next: NextFunction) {
    const image = req.body as CloudinaryImage;

    cloudinary.config({
        cloud_name: `${process.env.CLOUDINARY_NAME}`,
        api_key: `${process.env.CLOUDINARY_API_KEY}`,
        api_secret: `${process.env.CLOUDINARY_API_SECRET}`, // Essential for signature generation        
    });    

    //const timestamp = Math.floor((new Date()).getTime() / 1000)
    const timestamp = Math.round((new Date()).getTime() / 1000)
    const params_to_sign = {
        timestamp: timestamp, // Current Unix timestamp        
        public_id: image.public_id,        
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
        timestamp: timestamp
    });

}

async function cloudinaryUpdateFile(req: Request, res: Response, next: NextFunction) {
    const image = req.body as CloudinaryImage;

    cloudinary.config({
        cloud_name: `${process.env.CLOUDINARY_NAME}`,
        api_key: `${process.env.CLOUDINARY_API_KEY}`,
        api_secret: `${process.env.CLOUDINARY_API_SECRET}`
    });

    const result = await cloudinary.uploader.upload('./assetfolder/image.png', {
        public_id: image.public_id
    });

    res.status(200).json({
        status: 201,
        success: true,
        message: "File Uploaded",
        result: result,
        timestamp: image.timestamp
    });

}

export default { cloudinarySignature, cloudinaryUpdateFile }
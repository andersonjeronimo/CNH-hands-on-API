import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

import { CloudinaryImage } from '../utils/utils'

//aqui ESTÁ DIFERENTE
//https://cloudinary.com/documentation/generate_upload_signature_tutorial

async function cloudinarySignature(req: Request, res: Response, next: NextFunction) {
    const image = req.body as CloudinaryImage;

    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
        cloud_name: `${process.env.CLOUDINARY_NAME}`,
        api_key: `${process.env.CLOUDINARY_API_KEY}`,
        api_secret: `${process.env.CLOUDINARY_API_SECRET}` // Essential for signature generation
    });

    const timestamp = Math.round((new Date()).getTime() / 1000)
    const params_to_sign = {
        timestamp: timestamp, // Current Unix timestamp
        folder: image.asset_folder,
        public_id: image.public_id
    };

    //const signature = cloudinary.utils.api_sign_request(
    //{ timestamp, folder: 'user_uploads' }, // Parameters to sign
    //process.env.CLOUDINARY_API_SECRET

    const signature = cloudinary.utils.api_sign_request(
        params_to_sign,
        `${process.env.CLOUDINARY_API_SECRET}`
        //cloudinary.config().api_secret
    );

    //console.log('Signature:', signature);
    //console.log('Timestamp:', params_to_sign.timestamp);

    res.status(200).json({
        status: 201,
        success: true,
        message: "Signature created",
        signature: signature,
        timestamp: timestamp
    });

}

export default { cloudinarySignature }
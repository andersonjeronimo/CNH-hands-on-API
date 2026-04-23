import dotenv from 'dotenv';
dotenv.config();

//const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryImage } from '../utils/utils'

cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`, // Essential for signature generation        
});

async function getSignature(image: CloudinaryImage) {
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

    return { signature, timestamp };
}

export default { getSignature }
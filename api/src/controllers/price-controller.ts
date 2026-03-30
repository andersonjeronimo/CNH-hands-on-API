import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

import priceRepository from '../repositories/price-repository';
import Price from '../models/price';

async function getPrice(req: Request, res: Response, next: NextFunction) {    
    const result = await priceRepository.findPrice();    
    res.status(200).json({
        success: true,
        message: "Price found",
        result: result,
        timestamp: new Date().toISOString()
    });
}

async function setPrice(req: Request, res: Response, next: NextFunction) {
    const price = req.body;    
    const insertedId = await priceRepository.setPrice(price);    
    res.status(201).json({
        success: true,
        message: "Price created",
        result: insertedId,
        timestamp: new Date().toISOString()
    });
}

async function updatePrice(req: Request, res: Response, next: NextFunction) {
    const updatedPrice = req.body as Price;
    const upsertedId = await priceRepository.updatePrice(updatedPrice);
    res.status(204).json({
        success: true,
        message: "Price updated",
        result: upsertedId,
        timestamp: new Date().toISOString()
    });
}



export default { getPrice, setPrice, updatePrice }
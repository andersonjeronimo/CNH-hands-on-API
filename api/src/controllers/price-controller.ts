import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

import priceRepository from '../repositories/price-repository';
import { Price } from '../utils/utils';

async function setPrice(req: Request, res: Response, next: NextFunction) {
    const price = req.body as Price;
    const insertedId = await priceRepository.setPrice(price);
    var creationDate = insertedId.getTimestamp();    
    res.status(201).json({
        status: 201,
        success: true,
        message: "Price created",
        result: insertedId,
        timestamp: creationDate.toISOString()
    });
}

async function getPrice(req: Request, res: Response, next: NextFunction) {
    const result = await priceRepository.findPrice();
    var creationDate = result? result._id.getTimestamp() : new Date();
    res.status(200).json({
        status: result ? 200 : 404,
        success: result ? true : false,
        message: result ? "Price found" : "Price not found",
        result: result,
        timestamp: creationDate.toISOString()
    });
}

async function updatePrice(req: Request, res: Response, next: NextFunction) {
    let price: Price = req.body;
    const upsertedId = await priceRepository.updatePrice(price);
    var creationDate = upsertedId ? upsertedId.getTimestamp() : new Date();
    res.status(204).json({
        status: upsertedId ? 204 : 304,
        success: true,
        message: upsertedId ? "Price updated" : "Not Modified, No changes detected",
        result: upsertedId,
        timestamp: creationDate.toISOString()
    });
}



export default { getPrice, setPrice, updatePrice }
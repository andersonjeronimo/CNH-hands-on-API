import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

import priceRepository from '../repositories/price-repository';

async function getPrice(req: Request, res: Response, next: NextFunction) {    
    const response = await priceRepository.findPrice();
    res.status(200).json(response);
}

async function setPrice(req: Request, res: Response, next: NextFunction) {
    const newPrice = req.body;
    console.log(newPrice);
    const insertedId = await priceRepository.setPrice(newPrice);
    res.status(200).json(insertedId);
}

export default { getPrice, setPrice }
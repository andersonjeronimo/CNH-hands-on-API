import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import InstructorRepository from '../repositories/instructor-repository';
import Instructor from '../models/instructor';
//import Pagination from 'src/models/pagination';


async function insertInstructor(req: Request, res: Response, next: NextFunction) {
    const instructor = req.body as Instructor;    
    const insertedId = await InstructorRepository.insertInstructor(instructor);
    res.status(201).json(insertedId);
}

/*Webhook*/
async function updateInstructorStatus(req: Request, res: Response, next: NextFunction) {
    const { cpf } = req.body;
    const event = Array.isArray(req.params.event) ? req.params.is[0] : req.params.event;
    const result = await InstructorRepository.updateInstructorStatus(cpf, event);
    res.status(200).json(result);
}

async function findInstructorById(req: Request, res: Response, next: NextFunction) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await InstructorRepository.findInstructorById(id);    
    res.status(200).json(result);
}

async function findInstructorByUserId(req: Request, res: Response, next: NextFunction) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;    
    const result = await InstructorRepository.findInstructorByUserId(id);
    res.status(200).json(result);
}

async function findInstructorByCPF(req: Request, res: Response, next: NextFunction) {
    const cpf = Array.isArray(req.params.cpf) ? req.params.cpf[0] : req.params.cpf;
    const result = await InstructorRepository.findInstructorByCPF(cpf);    
    res.status(200).json(result);
}

async function findInstructorByCNPJ(req: Request, res: Response, next: NextFunction) {
    const cnpj = Array.isArray(req.params.cnpj) ? req.params.cnpj[0] : req.params.cnpj;
    const result = await InstructorRepository.findInstructorByCNPJ(cnpj);
    res.status(200).json(result);
}

async function findInstructor(req: Request, res: Response, next: NextFunction) {
    const query = req.body;
    const result = await InstructorRepository.findInstructor(query);
    res.status(200).json(result);
}

async function findInstructors(req: Request, res: Response, next: NextFunction) {
    const query = req.body.query;
    const { pageNumber, pageSize } = req.body.pagination;
    const skip = ((pageNumber - 1) * pageSize);

    const { category, vehicle, stateId, microregionId, callByMicroregion, cityId } = query;
    const result = await InstructorRepository.findInstructors(category, vehicle, stateId, cityId, microregionId, callByMicroregion, skip, pageSize);
    res.status(200).json(result);
}


export default {
    insertInstructor,
    updateInstructorStatus,
    findInstructorById,
    findInstructorByUserId,
    findInstructorByCPF,
    findInstructorByCNPJ,
    findInstructor,
    findInstructors
}
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import InstructorRepository from '../repositories/instructor-repository';
import Instructor from '../models/instructor';
//import Pagination from 'src/models/pagination';

/*Webhook*/
async function updateInstructorStatus(req: Request, res: Response, next: NextFunction) {
    const { cpf } = req.body;
    const event = Array.isArray(req.params.event) ? req.params.is[0] : req.params.event;
    const result = await InstructorRepository.updateInstructorStatus(cpf, event);
    res.status(200).json(result);
}

async function findInstructorById(req: Request, res: Response, next: NextFunction) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const Instructor = await InstructorRepository.findInstructorById(id);
    res.status(200).json(Instructor);
}

async function findInstructorByCPF(req: Request, res: Response, next: NextFunction) {
    const cpf = Array.isArray(req.params.cpf) ? req.params.cpf[0] : req.params.cpf;
    const Instructor = await InstructorRepository.findInstructorByCPF(cpf);
    console.log(Instructor);
    res.status(200).json(Instructor);
}

async function findInstructorByCNPJ(req: Request, res: Response, next: NextFunction) {
    const cnpj = Array.isArray(req.params.cnpj) ? req.params.cnpj[0] : req.params.cnpj;
    const Instructor = await InstructorRepository.findInstructorByCNPJ(cnpj);
    res.status(200).json(Instructor);
}

async function findInstructor(req: Request, res: Response, next: NextFunction) {
    const query = req.body;
    const Instructor = await InstructorRepository.findInstructor(query);
    res.status(200).json(Instructor);
}

async function findInstructors(req: Request, res: Response, next: NextFunction) {
    const query = req.body.query;        
    const { pageNumber, pageSize } = req.body.pagination;
    const skip = ((pageNumber - 1) * pageSize);    

    const { category, vehicle, stateId, microregionId, callByMicroregion, cityId } = query;
    const Instructors = await InstructorRepository.findInstructors(category, vehicle, stateId, cityId, microregionId, callByMicroregion, skip, pageSize);
    res.status(200).json(Instructors);

}

async function insertInstructor(req: Request, res: Response, next: NextFunction) {
    const Instructor = req.body as Instructor;
    const insertedId = await InstructorRepository.insertInstructor(Instructor);
    res.status(200).json(insertedId);
}

export default { 
    insertInstructor, 
    updateInstructorStatus, 
    findInstructorById, 
    findInstructorByCPF,
    findInstructorByCNPJ,
    findInstructor, 
    findInstructors }
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import InstructorRepository from '../repositories/instructor-repository';
import Instructor from '../models/instructor';
import { Properties } from "../utils/utils";


async function insertInstructor(req: Request, res: Response, next: NextFunction) {
    const instructor = req.body as Instructor;
    const insertedId = await InstructorRepository.insertInstructor(instructor);
    res.status(201).json({
        success: true,
        message: "Instructor created",
        result: insertedId,
        timestamp: new Date().toISOString()
    });
}

async function updateInstructor(req: Request, res: Response, next: NextFunction) {
    const instructor = req.body as Instructor;
    const upsertedId = await InstructorRepository.updateInstructor(instructor);
    res.status(204).json({
        success: true,
        message: "Instructor updated",
        result: upsertedId,
        timestamp: new Date().toISOString()
    });
}

/*Webhook*/
async function updateInstructorStatus(req: Request, res: Response, next: NextFunction) {
    const { cpf } = req.body;
    const event = Array.isArray(req.params.event) ? req.params.is[0] : req.params.event;
    const upsertedId = await InstructorRepository.updateInstructorStatus(cpf, event);
    res.status(204).json({
        success: true,
        message: "Instructor updated",
        result: upsertedId,
        timestamp: new Date().toISOString()
    });
}

async function findInstructor(req: Request, res: Response, next: NextFunction) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userid = Array.isArray(req.params.userid) ? req.params.userid[0] : req.params.userid;
    const cpf = Array.isArray(req.params.cpf) ? req.params.cpf[0] : req.params.cpf;
    const cnpj = Array.isArray(req.params.cnpj) ? req.params.cnpj[0] : req.params.cnpj;

    let props: Properties = {
        name: "",
        value: ""
    };

    if (id) {
        props.name = "id";
        props.value = id;
    }
    if (userid) {
        props.name = "userid";
        props.value = userid;
    }
    if (cpf) {
        props.name = "cpf";
        props.value = cpf;
    }
    if (cnpj) {
        props.name = "cnpj";
        props.value = cnpj;
    }


    const result = await InstructorRepository.findInstructor(props);
    res.status(200).json({
        success: true,
        message: "Instructor found",
        result: result,
        timestamp: new Date().toISOString()
    });
}


//async function findInstructorById(req: Request, res: Response, next: NextFunction) {
//    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//    const result = await InstructorRepository.findInstructorById(id);
//    res.status(200).json({
//        success: true,
//        message: "Instructor found",
//        result: result,
//        timestamp: new Date().toISOString()
//    });
//}

//async function findInstructorByUserId(req: Request, res: Response, next: NextFunction) {
//    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//    const result = await InstructorRepository.findInstructorByUserId(id);
//    res.status(200).json({
//        success: true,
//        message: "Instructor found",
//        result: result,
//        timestamp: new Date().toISOString()
//    });
//}

//async function findInstructorByCPF(req: Request, res: Response, next: NextFunction) {
//    const cpf = Array.isArray(req.params.cpf) ? req.params.cpf[0] : req.params.cpf;
//    const result = await InstructorRepository.findInstructorByCPF(cpf);
//    res.status(200).json({
//        success: true,
//        message: "Instructor found",
//        result: result,
//        timestamp: new Date().toISOString()
//    });
//}

//async function findInstructorByCNPJ(req: Request, res: Response, next: NextFunction) {
//    const cnpj = Array.isArray(req.params.cnpj) ? req.params.cnpj[0] : req.params.cnpj;
//    const result = await InstructorRepository.findInstructorByCNPJ(cnpj);
//    res.status(200).json({
//        success: true,
//        message: "Instructor found",
//        result: result,
//        timestamp: new Date().toISOString()
//    });
//}

async function findInstructors(req: Request, res: Response, next: NextFunction) {
    const query = req.body.query;
    const { pageNumber, pageSize } = req.body.pagination;
    const skip = ((pageNumber - 1) * pageSize);

    const { category, vehicle, stateId, microregionId, callByMicroregion, cityId } = query;
    const result = await InstructorRepository.findInstructors(category, vehicle, stateId, cityId, microregionId, callByMicroregion, skip, pageSize);
    res.status(200).json({
        success: true,
        message: "Instructor found",
        result: result,
        timestamp: new Date().toISOString()
    });
}


export default {
    insertInstructor,
    updateInstructor,
    updateInstructorStatus,
    //findInstructorById,
    //findInstructorByUserId,
    //findInstructorByCPF,
    //findInstructorByCNPJ,
    findInstructor,
    findInstructors
}
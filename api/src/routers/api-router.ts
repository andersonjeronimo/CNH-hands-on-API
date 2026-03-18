import express from "express";
import instructorController from '../controllers/instructor-controller';
import authController from '../controllers/auth-controller';
import priceController from '../controllers/price-controller';

const router = express.Router();

import { authMiddleware } from "../middlewares/auth-middleware";

/*Webhooks*/
router.post('/webhook/:event', instructorController.updateInstructorStatus);
/*login*/
router.post('/user', authController.create);
//router.get('/user/:id', authController.findUser);
router.post('/auth', authController.auth);

//router.use(authMiddleware);--> assim, todas as rotas abaixo serão protegidas
/*price*/
router.get('/price', authMiddleware, priceController.getPrice);
router.post('/price', authMiddleware, priceController.setPrice);
/*instructors*/
router.post('/instructor', authMiddleware, instructorController.insertInstructor);
router.get('/instructor/:id', authMiddleware, instructorController.findInstructorById);
router.get('/instructor/by-user-id/:id', authMiddleware, instructorController.findInstructorByUserId);
router.get('/instructor/by-cpf/:cpf', authMiddleware, instructorController.findInstructorByCPF);
router.get('/instructor/by-cnpj/:cnpj', authMiddleware, instructorController.findInstructorByCNPJ);
router.post('/instructor/search', authMiddleware, instructorController.findInstructors);

export default router;
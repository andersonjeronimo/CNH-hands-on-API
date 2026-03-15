import express from "express";
import instructorController from '../controllers/instructor-controller';
import authController from '../controllers/auth-controller';
import priceController from '../controllers/price-controller';

const router = express.Router();

/*price*/
router.get('/price', priceController.getPrice);
router.post('/price', priceController.setPrice);
/*Webhooks*/
router.post('/webhook/:event', instructorController.updateInstructorStatus);
/*login*/
router.post('/user', authController.create);
router.post('/auth', authController.auth);
/*instructors*/
router.post('/instructor', instructorController.insertInstructor);
router.get('/instructor/:id', instructorController.findInstructorById);
router.get('/instructor/by-user-id/:id', instructorController.findInstructorByUserId);
router.get('/instructor/by-cpf/:cpf', instructorController.findInstructorByCPF);
router.get('/instructor/by-cnpj/:cnpj', instructorController.findInstructorByCNPJ);
router.post('/instructor/search', instructorController.findInstructors);

export default router;
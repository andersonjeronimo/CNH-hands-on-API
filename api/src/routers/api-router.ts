import express from "express";
import instructorController from '../controllers/instructor-controller';
import authController from '../controllers/auth-controller';
import priceController from '../controllers/price-controller';

const router = express.Router();

import auth from '../middlewares/auth-middleware';

/*Webhooks*/
router.post('/webhook/:event', instructorController.updateInstructorStatus);
/*login*/
router.post('/user', authController.create);
//router.get('/user/:id', authController.findUser);
router.post('/auth', authController.auth);

//router.use(auth.hasJwt, auth.isAuthorized);--> assim, todas as rotas abaixo serão protegidas
/*price*/
router.get('/price', priceController.getPrice);
router.post('/price', auth.hasJwt, auth.isAuthorized, priceController.setPrice);
router.put('/price', auth.hasJwt, auth.isAuthorized, priceController.updatePrice);
/*instructors*/
router.post('/instructor', auth.hasJwt, auth.isAuthorized, instructorController.insertInstructor);
router.get('/instructor', auth.hasJwt, auth.isAuthorized, instructorController.findInstructors);
router.put('/instructor', auth.hasJwt, auth.isAuthorized, instructorController.updateInstructor);
router.post('/instructor/search', auth.hasJwt, auth.isAuthorized, instructorController.findInstructors);
/*instructors by filter*/
router.get('/instructor/:id', auth.hasJwt, auth.isAuthorized, instructorController.findInstructor);
router.get('/instructor/by-user-id/:userid', auth.hasJwt, auth.isAuthorized, instructorController.findInstructor);
router.get('/instructor/by-cpf/:cpf', auth.hasJwt, auth.isAuthorized, instructorController.findInstructor);
router.get('/instructor/by-cnpj/:cnpj', auth.hasJwt, auth.isAuthorized, instructorController.findInstructor);

export default router;
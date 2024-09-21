import express from 'express';
import { userController } from '../controllers/userController';
const router = express.Router();



router.post("/register/:key", userController.registerUser);

router.post("/verify_otp/:key", userController.verifyUser);



export default router
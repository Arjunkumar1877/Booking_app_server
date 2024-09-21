import express from 'express';
import { userController } from '../controllers/userController';
const router = express.Router();



router.post("/register/:key", userController.registerUser);

router.post("/verify_otp/:key", userController.verifyUser);

router.post("/login/:key", userController.loginUser);

router.post('/resend_otp/:key', userController.resendOtp)

export default router
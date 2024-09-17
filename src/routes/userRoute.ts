import express from 'express';
import { userController } from '../controllers/userController';
const router = express.Router();



router.post("/register/:key", userController.registerUser);



export default router
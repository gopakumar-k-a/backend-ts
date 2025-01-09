import express, { Router } from "express";
import { authController } from "../controllers/authController";

const router:Router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refresh', authController.refreshToken);

export default router;

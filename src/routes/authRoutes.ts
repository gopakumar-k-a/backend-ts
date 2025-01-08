import express, { Router } from "express";
import { authController } from "../controllers/authController";

const router:Router = express.Router();
// const controller = authController();  // Call the function to get the methods

// Correct usage of controller methods
// router.get("/register", async (req, res) => {
//   res.status(200).json({ message: "success" });
// });
// router.get("/", async (req, res) => {
//   res.status(200).json({ message: "success" });
// });

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refresh', authController.refreshToken);

export default router;

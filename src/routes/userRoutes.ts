import express, { Router } from "express";
import { userController } from "../controllers/userController";
import upload from "../utils/multer";

const router: Router = express.Router();

router.put("/change-password", userController.changePassword);
router.post('/upload-files',upload.array('files'),userController.handleFileUpload)
export default router;

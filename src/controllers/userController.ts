import { Request, Response } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import { userValidator } from "../validators/userValidator";
import { ExtendedRequest } from "../middlewares/verifyAccessToken";
import FormData from "../models/FormModel";
import path from "path";
export const userController = {
  changePassword: async (
    req: ExtendedRequest,
    res: Response
  ): Promise<void> => {
    try {
      console.log("hello hi");

      const errors = userValidator.validateChangePassword(req.body);
      console.log("errors ", errors);

      if (errors.length) {
        res.status(400).json({ errors });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: "Authorization header missing" });
        return;
      }

      const userId = req.user;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(401).json({ error: "Current password is incorrect." });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await user.save();

      res
        .status(200)
        .json({ message: "Password changed successfully.", success: true });
    } catch (error) {
      console.error("Error during password change:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  },
  handleFileUpload: async (
    req: ExtendedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const files: Express.Multer.File[] = req.files
        ? (req.files as Express.Multer.File[])
        : [];

      console.log("req body ", req.body);
      console.log("req file ", req.files);
      const formErrors = userValidator.validateFormData(req.body);
      const fileErrors = userValidator.validateFileUploads(files);

      console.log("fileerrors ", fileErrors);
      console.log("formErrors ", formErrors);

      if (formErrors.length > 0 || fileErrors.length > 0) {
        res.status(400).json({
          message: "Validation failed",
          errors: { ...formErrors, ...fileErrors },
        });
        return;
      }
      const filePaths = files.map((file) =>
        path.join("public", "admin-assets", "uploads", file.filename)
      );
      const {
        text,
        email,
        password,
        date,
        number,
        checkbox,
        radio,
        textarea,
        select,
      } = req.body;

      const newFormData = new FormData({
        text,
        email,
        password,
        date,
        number,
        checkbox,
        radio,
        textarea,
        select,
        files: filePaths,
      });

      await newFormData.save();

      res.status(200).json({
        message: "Form data and files uploaded successfully",
        success: true,
      });
    } catch (error) {
      console.error("Error during password change:", error);
      res.status(500).json({ error: "Failed to change upload file" });
    }
  },
};

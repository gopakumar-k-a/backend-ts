import { Request, Response } from "express";
import { authValidator } from "../validators/authValidator";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import { tokenGenerator } from "../helpers/tokenGenerator";
import { tokenVerifier } from "../helpers/tokenVerifier";

export const authController = {
  registerUser: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('hello hi');
      console.log(req.body);
      
      
      const errors = authValidator.validateRegister(req.body);
      if (errors.length) {
        res.status(400).json({ errors });
        return;
      }

      const { name, address, password, gender, userName } = req.body;

      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        res.status(400).json({ error: " userName already registered" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        userName: userName.toLowerCase(),
        password: hashedPassword,
        address,
        gender,
      });

      const createdUser = {
        name: newUser.name,
        userName: newUser.userName,
      };

      res
        .status(201)
        .json({ message: "User registered successfully", user: createdUser });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Failed to register" });
    }
  },

  loginUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = authValidator.validateLogin(req.body);
      if (errors.length) {
        res.status(400).json({ errors });
        return;
      }

      const { userName, password } = req.body;

      const user = await User.findOne({ userName });
      if (!user) {
        res.status(406).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(406).json({ error: "Invalid credentials" });
        return;
      }

      const accessToken = tokenGenerator.generateAccessToken(
        user._id as string
      );
      const refreshToken = tokenGenerator.generateRefreshToken(
        user._id as string
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({ accessToken });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  },

  refreshToken: async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;
        const verificationResult =
          tokenVerifier.verifyRefreshToken(refreshToken);

        if (!verificationResult.valid || !verificationResult.decoded) {
          res
            .status(406)
            .json({ message: "Unauthorized", error: verificationResult.error });
          return;
        }

        const accessToken = tokenGenerator.generateAccessToken(
          verificationResult.decoded.id as string
        );
        res.json({ accessToken });
      } else {
        res.status(406).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error("Error during refresh token:", error);
      res.status(406).json({ message: "Unauthorized catch" });
    }
  },
};

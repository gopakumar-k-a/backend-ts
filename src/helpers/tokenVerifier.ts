import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();

// Define a type for the result returned by the verification functions
interface VerificationResult {
  valid: boolean;
  decoded?: JwtPayload; // Decoded token is of type JwtPayload
  error?: string;
}

export const tokenVerifier = {
  verifyAccessToken: (token: string): VerificationResult => {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
      return { valid: true, decoded };
    } catch (err: any) {
      return { valid: false, error: err.message };
    }
  },

  verifyRefreshToken: (token: string): VerificationResult => {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
      return { valid: true, decoded };
    } catch (err: any) {
      return { valid: false, error: err.message };
    }
  },
};

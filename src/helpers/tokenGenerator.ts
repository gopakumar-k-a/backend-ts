import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


interface TokenGenerator {
  generateAccessToken: (id: string) => string;
  generateRefreshToken: (id: string) => string;
}

export const tokenGenerator: TokenGenerator = {
  generateAccessToken: (id: string): string => {
    
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: '15m',
    });
  },
  generateRefreshToken: (id: string): string => {
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: '1d',
    });
    return refreshToken;
  },
};

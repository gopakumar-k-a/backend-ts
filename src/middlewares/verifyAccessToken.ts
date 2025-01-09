import { Request, Response, NextFunction } from "express";
import { tokenVerifier } from "../helpers/tokenVerifier";
import { VerificationResult } from "../helpers/tokenVerifier";
export interface ExtendedRequest extends Request {
  user?: any;
}

export const verifyAccessToken = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }

  const token = authHeader.split(" ")[1];
  console.log("token is ", token);

  const verificationResult: VerificationResult =
    tokenVerifier.verifyAccessToken(token);

  if (!verificationResult.valid || !verificationResult.decoded) {
    console.log('error is ',verificationResult.error);
    
    res
      .status(403)
      .json({ message: "Forbidden", error: verificationResult.error });
    return;
  }

  console.log("verificationResult.decoded ", verificationResult.decoded);
  req.user = verificationResult.decoded.id;
  next();
};

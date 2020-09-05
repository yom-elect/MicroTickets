import { Request } from "express";
import jwt from "jsonwebtoken";
import { UserDoc } from "../models/user";
import { JWT_SECRET_KEY } from "../config/dbConfig";

export const userToken = (user: UserDoc): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET_KEY! || "microtestservice"
  );
};

export const verifyUserToken = (req: Request) => {
  return jwt.verify(req.session?.jwt, JWT_SECRET_KEY! || "microtestservicet");
};
// echo -n 'string' | base64

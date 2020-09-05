import express, { Request, Response } from "express";
import { body } from "express-validator";

import { Password } from "../helpers/password";
import { User } from "../models/user";
import { userToken } from "../helpers/jwt";

//import { validateRequest } from "../../../common/src/middlewares/validate-request";
import { validateRequest, BadRequestError } from "@microtickets/common";
//import { BadRequestError } from "../../../common/src/errors/badRequest-error";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").trim().isEmail().withMessage("Enter Valid Email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) throw new BadRequestError("Invalid Credentials");
    // Generate JWT
    const userJwt = userToken(existingUser);
    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send({
      message: "Successful Signed In",
      data: existingUser,
    });
  }
);

export { router as signInRouter };

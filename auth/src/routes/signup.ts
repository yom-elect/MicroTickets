import express, { Request, Response } from "express";
import { body } from "express-validator";

import { User } from "../models/user";
import { userToken } from "../helpers/jwt";

//import { validateRequest } from "../../../common/src/middlewares/validate-request";
import { validateRequest, BadRequestError } from "@microtickets/common";
//import { BadRequestError } from "../../../common/src/errors/badRequest-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").trim().isEmail().withMessage("Enter Valid Email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 Characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }
    const user = User.build({
      email,
      password,
    });
    await user.save();

    // Generate JWT

    const userJwt = userToken(user);
    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send({
      message: "sign up successful",
      data: user,
    });
  }
);

export { router as signUpRouter };

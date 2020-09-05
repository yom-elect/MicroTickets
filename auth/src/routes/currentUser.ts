import express from "express";
const router = express.Router();

//import { currentUser } from "../../../common/src/middlewares/current-user";
import { currentUser } from "@microtickets/common";
//import { verifyUserToken } from "../helpers/jwt";

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.status(200).send({
    currentUser: req.currentUser || null,
  });
});

export { router as currentUserRouter };

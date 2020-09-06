import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

// import { errorHandler } from "../../common/src/middlewares/error-handler";
// import { NotFoundError } from "../../common/src/errors/notFound-error";
import { NotFoundError, errorHandler, currentUser } from "@microtickets/common";
import { CreateChargeRouter } from "../src/routes/newCharge";

const app = express();

// because server is behind the  ingress nginx proxy
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

// route to create charge on order tickets
app.use(CreateChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

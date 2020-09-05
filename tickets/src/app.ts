import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import { showTicketRouter } from "./routes/showtickets";
import { createTicketRouter } from "./routes/newtickets";
import { updateTicketRouter } from "./routes/update";
import { indexTicketsRouter } from "./routes/index";
// import { errorHandler } from "../../common/src/middlewares/error-handler";
// import { NotFoundError } from "../../common/src/errors/notFound-error";
import { NotFoundError, errorHandler, currentUser } from "@microtickets/common";

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

app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(indexTicketsRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

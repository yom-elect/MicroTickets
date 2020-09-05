import mongoose from "mongoose";
import { dbConfig } from "./config/dbConfig";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

//Database connection
const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!dbConfig.url)
    throw new Error("Database Connection string required must be defined");
  if (!dbConfig.clusterId) throw new Error("Nats Cluster ID not defined");
  try {
    await natsWrapper.connect(
      dbConfig.clusterId,
      dbConfig.natsClientId,
      dbConfig.natsUrl
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (err) {
    console.log(err.message);
  }
  app.listen(4000, () => {
    console.log("Listening on port 4000!!!");
  });
};

start();

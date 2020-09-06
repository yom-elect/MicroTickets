import { dbConfig } from "./config/dbConfig";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

//Database connection
const start = async () => {
  if (!dbConfig.clusterId) throw new Error("Nats Cluster ID not defined");
  try {
    await natsWrapper.connect(
      dbConfig.clusterId,
      dbConfig.natsClientId,
      dbConfig.natsUrl
    );
      // Nats streaming connection 
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err.message);
  }
};

start();

import dotenv from "dotenv";
dotenv.config();

const user = process.env.MONGO_USERNAME;
const pwd = process.env.MONGO_PASSWORD;
//${user}:${pwd}@
export const dbConfig = {
  url: process.env.MONGO_URI!,
  clusterId: process.env.NATS_CLUSTER_ID!,
  natsClientId: process.env.NATS_CLIENT_ID!,
  natsUrl: process.env.NATS_URL!,
};

export const JWT_SECRET_KEY = process.env.JWT_KEY;

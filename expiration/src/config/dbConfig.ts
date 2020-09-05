import dotenv from "dotenv";
dotenv.config();

//${user}:${pwd}@
export const dbConfig = {
  clusterId: process.env.NATS_CLUSTER_ID!,
  natsClientId: process.env.NATS_CLIENT_ID!,
  natsUrl: process.env.NATS_URL!,
};

export const JWT_SECRET_KEY = process.env.JWT_KEY;

import dotenv from "dotenv";
dotenv.config();

const user = process.env.MONGO_USERNAME;
const pwd = process.env.MONGO_PASSWORD;
//${user}:${pwd}@
export const dbConfig = {
  url: process.env.MONGO_URI!,
};

export const JWT_SECRET_KEY = process.env.JWT_KEY;

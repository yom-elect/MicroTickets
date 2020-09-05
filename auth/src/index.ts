import mongoose from "mongoose";
import { dbConfig } from "./config/dbConfig";
import { app } from "./app";

//Database connection
const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  try {
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

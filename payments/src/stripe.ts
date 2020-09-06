import Stripe from "stripe";
import { dbConfig } from "./config/dbConfig";

const token = dbConfig.STRIPE_API_KEY;
export const stripe = new Stripe(token, {
  apiVersion: "2020-08-27",
});

//"sk_test_3EUvsjZyWqs4JKCpXfyDfm4b008vuiThI4"

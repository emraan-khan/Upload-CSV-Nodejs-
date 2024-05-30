import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// connect to the mongo-db
export const connectDB = async () => {
  try {
    //console.log("db connecting...");
      const res = await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongodb connected with server ${res.connection.host}`);
  } catch (error) {
    console.log("mongodb connection failed!");
    console.log(error);
  }
};
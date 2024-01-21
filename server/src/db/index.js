import mongoose from "mongoose";
import { apiError } from "../utils/apiError.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(`DB connected ${connection.connections[0].host}`);
  } catch (error) {
    throw new apiError(401, error.messege);
  }
};

export { connectDB };

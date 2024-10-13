import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `Database Connection Established! on ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`Database Connection Failed! Error: ${error.message}`);
  }
};

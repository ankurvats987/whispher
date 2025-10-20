import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );

    // await Follows.syncIndexes();
    console.log(
      "Successfully connected to MongoDB through host:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error(`DB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB };

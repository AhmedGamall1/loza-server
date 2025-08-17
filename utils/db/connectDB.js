import mongoose from "mongoose";
export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONOGODB_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB", error.message);
  }
};

import dotenv from "dotenv";
import { server } from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`App is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Refused:", err);
  });

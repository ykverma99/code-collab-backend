import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import user from "./routes/user.js";
import file from "./routes/codeFile.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DBPort = process.env.MONGO;

const connetctDB = async () => {
  try {
    await mongoose.connect(DBPort);
    console.log("DB Connect");
  } catch (error) {
    console.log("Mongoose error", error);
  }
};

connetctDB();

app.use("/user/api", user);
app.use("/file/api", file);

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`Server is running http://localhost:${port}`)
);

import express from "express";
import { loginUser, signupUser } from "../controller/authController.js";
import {
  deleteOne,
  findAllUsers,
  findOneUser,
  updateOne,
} from "../controller/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/user", findAllUsers);
router.get("/user/:userId", findOneUser);
router.put("/user/:userId", updateOne);
router.delete("/user/:userId", deleteOne);

export default router;

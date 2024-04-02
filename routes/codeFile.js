import express from "express";
import {
  createFile,
  deleteFile,
  getAllFiles,
  oneFile,
  updateFile,
  userFiles,
} from "../controller/codeFileController.js";

const router = express.Router();

router.post("/create", createFile);
router.get("/file", getAllFiles);
router.get("/file/:fileId", oneFile);
router.get("/userfile/:userId", userFiles);
router.patch("/file/:fileId", updateFile);
router.delete("/file/:fileId", deleteFile);

export default router;

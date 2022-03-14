import express, { Router } from "express";
import {
  createUser,
  logUser,
  getUser,
  deleteUser,
  editUser,
} from "../controller/user-controller.js";
import upload from "../utils/upload.js";
import { authenticate } from "../controller/authentication.js";
import { getImage, uploadImage } from "../controller/image-controller.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/file/upload", upload.single("file"), uploadImage);
router.post("/login", logUser);
router.get("/file/:filename", getImage);
router.get("/getuser", authenticate, getUser);
router.delete("/deleteprofile", authenticate, deleteUser);
router.post("/editprofile", editUser);
export default router;

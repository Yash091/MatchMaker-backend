import express, { Router } from "express";
import {
  createUser,
  logUser,
  getUser,
  deleteUser,
  editUser,
  getAllUser,
  getDetail,
  updateLike,
  updateDislike,
  allUsers,
  removeNotification,
  clearNotification,
  logoutUser
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
router.get("/getalluser/:id",getAllUser);
router.get("/allUsers", allUsers);
router.delete("/deleteprofile", authenticate, deleteUser);
router.post("/editprofile" , editUser);
router.get("/getdetail/:id",getDetail)
router.post("/updatelike",updateLike);
router.post("/updatedislike",updateDislike);
router.post("/removenotification",removeNotification)
router.post("/clearnotification",clearNotification)
router.get("/logout",authenticate,logoutUser);
export default router;
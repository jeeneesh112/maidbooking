import express from "express";
import { userInfo } from "../controllers/profileController.mjs";
import { verifyToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post("/userInfo", verifyToken, userInfo);

export default router;

import express from "express";
import { userInfobyId } from "../controllers/profileController.mjs";
import { verifyToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post("/userInfo", verifyToken, userInfobyId);

import express from "express";
import { userInfo } from "../controllers/profileController.mjs";
import { verifyToken } from '../middleware/authMiddleware.mjs';
import { authorizeRoles } from "../middleware/authorizeRoles.mjs";

const router = express.Router();

router.post("/userInfo", verifyToken,authorizeRoles("view_profile"), userInfo);

export default router;

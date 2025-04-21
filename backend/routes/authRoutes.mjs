import express from 'express';

import { signup, login, verifyOtp } from "../controllers/authController.mjs";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify_otp', verifyOtp);

export default router;
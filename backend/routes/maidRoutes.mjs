import express from 'express';
import {
  addMaid,
  getMaidsByArea,
  getMaidById,
  deleteMaid,
  updateMaid
} from '../controllers/maidController.mjs';

import { verifyToken } from '../middleware/authMiddleware.mjs';
import { isAdmin } from '../middleware/roleMiddleware.mjs';

const router = express.Router();

router.post('/add', verifyToken, isAdmin, addMaid);
router.post('/get_by_area', verifyToken, getMaidsByArea);
router.post('/get_by_id', verifyToken, getMaidById);
router.post('/delete', verifyToken, isAdmin, deleteMaid);
router.post('/update', verifyToken, isAdmin, updateMaid);


export default router;
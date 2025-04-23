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
import {authorizeRoles} from '../middleware/authorizeRoles.mjs';

const router = express.Router();

router.post('/add', verifyToken, authorizeRoles("manage_maids"), addMaid);
router.post('/get_by_area', verifyToken,authorizeRoles("manage_maids"), getMaidsByArea);
router.post('/get_by_id', verifyToken, getMaidById);
router.post('/delete', verifyToken, authorizeRoles("manage_maids"), deleteMaid);
router.post('/update', verifyToken, isAdmin, updateMaid);


export default router;
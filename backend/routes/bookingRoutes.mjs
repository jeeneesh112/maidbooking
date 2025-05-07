import express from 'express';
import { bookMaid , getmaidbyUser } from '../controllers/bookingController.mjs';
import { verifyToken } from '../middleware/authMiddleware.mjs';
import { authorizeRoles } from '../middleware/authorizeRoles.mjs';

const router = express.Router();

router.post('/create', verifyToken, authorizeRoles("manage_bookings"), bookMaid);
router.post('/get_by_user', verifyToken, getmaidbyUser);
// router.get('/all_bookings', verifyToken, isAdmin, getAllBookings);

export default router;
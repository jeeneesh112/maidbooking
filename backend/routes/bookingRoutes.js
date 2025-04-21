import express from 'express';
import { bookMaid , getBookingsByUser } from '../controllers/bookingController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/book', verifyToken, bookMaid);
router.get('/user_bookings', verifyToken, getBookingsByUser);
router.get('/all_bookings', verifyToken, isAdmin, getAllBookings);

export default router;
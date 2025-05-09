import express from 'express';
import { bookMaid , getmaidbyUser ,allmaidBookings,getmaidviseBookings, changeBookingStatus} from '../controllers/bookingController.mjs';
import { verifyToken } from '../middleware/authMiddleware.mjs';
import { authorizeRoles } from '../middleware/authorizeRoles.mjs';

const router = express.Router();

router.post('/create', verifyToken, bookMaid);
router.post('/get_by_user', verifyToken, getmaidbyUser);
router.post('/all_bookings', verifyToken, authorizeRoles("manage_bookings"), allmaidBookings);
router.post('/get_by_maid', verifyToken, authorizeRoles("manage_bookings"), getmaidviseBookings);
router.post("/change_booking_status", verifyToken,authorizeRoles("manage_bookings"),changeBookingStatus);

export default router;
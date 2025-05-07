import express from 'express';
import { bookMaid , getmaidbyUser ,allmaidBookings,getmaidviseBookings} from '../controllers/bookingController.mjs';
import { verifyToken } from '../middleware/authMiddleware.mjs';
import { authorizeRoles } from '../middleware/authorizeRoles.mjs';

const router = express.Router();

router.post('/create', verifyToken, bookMaid);
router.post('/get_by_user', verifyToken, getmaidbyUser);
router.post('/all_bookings', verifyToken, authorizeRoles("manage_bookings"), allmaidBookings);
router.post('/get_by_maid', verifyToken, authorizeRoles("manage_bookings"), getmaidviseBookings);

export default router;
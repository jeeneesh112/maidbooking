import Booking from "../models/Booking.mjs";
import Maid from "../models/Maid.mjs";

export const bookMaid = async (req, res) => {
    const { maidId, bookingDate,availability, services } = req.body;
    const userId = req.user.id;

    const maid = await Maid.findById(maidId);
    if (!maid) {
        return res.status(404).json({ message: "Maid not found" });
    }

    const startDate = new Date(bookingDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    const totalAmount = maid.salaryPerMonth * durationMonths;

    const bookingBody = {
        userId,
        maidId,
        durationMonths,
        startDate,
        endDate,
        totalAmount,
        availability,
        services
    };

    try {
        await Booking.create(bookingBody);
        res.status(201).json({ message: "Booking created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getBookingsByUser = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
  
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('maidId')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(Number(limit));
  
    const total = await Booking.countDocuments({ userId: req.user.id });
  
    res.json({ total, page: Number(page), limit: Number(limit), bookings });
  };

  export const getAllBookings = async (req, res) => {
    const { page = 1, limit = 10, area, city } = req.query;
    const skip = (page - 1) * limit;
  
    const filter = {};
    if (area) filter['maidId.area'] = area;
    if (city) filter['maidId.city'] = city;
  
    const bookings = await Booking.find()
      .populate('maidId')
      .populate('userId')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(Number(limit));
  
    const total = await Booking.countDocuments();
  
    res.json({ total, page: Number(page), limit: Number(limit), bookings });
  };
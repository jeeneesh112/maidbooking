import Booking from "../models/Booking.mjs";
import Maid from "../models/Maid.mjs";

export const bookMaid = async (req, res) => {
  const { maidId, startDate, availability, services, durationMonths } =
    req.body;
  console.log("Booking request body:", req.body);
  const userId = req.user.id;

  const maid = await Maid.findById(maidId);
  console.log("Maid found:", maid);
  if (!maid) {
    return res.status(404).json({ message: "Maid not found" });
  }

  const startingDate = new Date(startDate);
  const endDate = new Date(startingDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);

  const selectedServicesSalary = maid.services
    .filter((service) => services.includes(service.name))
    .reduce((sum, service) => sum + service.salary, 0);

  const totalAmount = selectedServicesSalary * durationMonths;

  const bookingBody = {
    userId,
    maidId,
    durationMonths,
    startDate: startingDate,
    endDate,
    totalAmount,
    availability,
    services,
  };

  console.log("Booking body:", bookingBody);

  try {
    const data = await Booking.create(bookingBody);
    res.status(201).json({ message: "Booking created successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getmaidbyUser = async (req, res) => {
  const {  page = 1, limit = 10 } = req.body;
  const skip = (page - 1) * limit;

  const userId = req.user.id;

  const total = await Booking.countDocuments({ userId });

  const bookings = await Booking.find({ userId })
    .skip(skip)
    .limit(Number(limit))
    .sort({ startDate: 1 });

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    bookings,
  });
};

export const getAllBookings = async (req, res) => {
  const { page = 1, limit = 10, area, city } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (area) filter["maidId.area"] = area;
  if (city) filter["maidId.city"] = city;

  const bookings = await Booking.find()
    .populate("maidId")
    .populate("userId")
    .sort({ startDate: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Booking.countDocuments();

  res.json({ total, page: Number(page), limit: Number(limit), bookings });
};

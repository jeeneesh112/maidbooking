import Booking from "../models/Booking.mjs";
import Maid from "../models/Maid.mjs";
import mongoose from "mongoose";

export const bookMaid = async (req, res) => {
  const {
    maidId,
    startDate,
    availability,
    services,
    durationMonths,
    street,
    city,
    state,
    country,
    pincode,
  } = req.body;
  const userId = req.user.id;

  const maid = await Maid.findById(maidId);
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
    durationMonths: Number(durationMonths),
    startDate: startingDate,
    endDate,
    totalAmount,
    availability,
    services,
    address: {
      street: street,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
    },
  };

  console.log("bookingBody",bookingBody)

  try {
    const data = await Booking.create(bookingBody);
    res.status(201).json({ message: "Booking created successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getmaidbyUser = async (req, res) => {
  const { page = 1, limit = 10 } = req.body;
  const skip = (page - 1) * limit;

  const userId = req.user.id;

  const total = await Booking.countDocuments({ userId });

  // const bookings = await Booking.find({ userId })
  //   .skip(skip)
  //   .limit(Number(limit))
  //   .sort({ startDate: 1 });

  const aggregate = [
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "maids",
        localField: "maidId",
        foreignField: "_id",
        as: "maidDetails",
      },
    },
    {
      $unwind: "$maidDetails",
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        maidId: 1,
        startDate: 1,
        endDate: 1,
        availability: 1,
        services: 1,
        status: 1,
        totalAmount: 1,
        durationMonths: 1,
        maidDetails: {
          name: "$maidDetails.name",
          area: "$maidDetails.area",
          city: "$maidDetails.city",
          phoneNumber: "$maidDetails.phoneNumber",
          imageUrl: "$maidDetails.imageUrl",
          salaryPerMonth: "$maidDetails.salaryPerMonth",
          services: "$maidDetails.services",
        },
      },
    },
    { $sort: { startDate: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const bookings = await Booking.aggregate(aggregate);

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    bookings,
  });
};

export const allmaidBookings = async (req, res) => {
  const { page = 1, limit = 10 } = req.body;
  const skip = (page - 1) * limit;

  const total = await Booking.countDocuments();

  const aggregate = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        maidId: 1,
        startDate: 1,
        endDate: 1,
        availability: 1,
        services: 1,
        status: 1,
        totalAmount: 1,
        durationMonths: 1,
        userDetails: {
          name: "$userDetails.name",
          mobile: "$userDetails.mobile",
        },
      },
    },
    { $sort: { startDate: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const bookings = await Booking.aggregate(aggregate);

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    bookings,
  });
};

export const getmaidviseBookings = async (req, res) => {
  const { maidId } = req.body;

  const total = await Booking.countDocuments();

  const aggregate = [
    {
      $match: {
        maidId: mongoose.Types.ObjectId(maidId),
      },
    },
    {
      $lookup: {
        from: "maids",
        localField: "maidId",
        foreignField: "_id",
        as: "maidDetails",
      },
    },
    {
      $unwind: "$maidDetails",
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        maidId: 1,
        startDate: 1,
        endDate: 1,
        availability: 1,
        services: 1,
        status: 1,
        totalAmount: 1,
        durationMonths: 1,
        maidDetails: {
          name: "$maidDetails.name",
          area: "$maidDetails.area",
          city: "$maidDetails.city",
          mobile: "$maidDetails.mobile",
          picture: "$maidDetails.picture",
          salaryPerMonth: "$maidDetails.salaryPerMonth",
          services: "$maidDetails.services",
          status: "$maidDetails.status",
          availability: "$maidDetails.availability",
        },
      },
    },
    { $sort: { startDate: -1 } },
  ];

  const bookings = await Booking.aggregate(aggregate);

  res.json({
    total,
    bookings,
  });
};

export const changeBookingStatus = async (req, res) => {
  console.log("req.body",req.body)
  const { maidId, userId, bookingId, status } = req.body;

  const agentId =  req.user.id;

  const bookingData = await Booking.findOne({
    _id: bookingId,
  });
  if (!bookingData) {
    return res.status(404).json({ message: "Booking Data not found" });
  }
  try {
     await Booking.updateOne(
      {
        _id: bookingId,
        userId: userId,
      },
      {
        $set: {
          agentId: agentId,
          maidId: maidId,
          status : status
        },
      }
    );
    res
      .status(201)
      .json({
        message: "Booking Status updated Successfully",
        bookingId: bookingData._id,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

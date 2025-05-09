import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    maidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maid",
      required: true,
    },
    agentId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    availability: {
      type: String,
      required: true,
      enum: ["morning", "night", "full-day"],
    },
    services: {
      type: [String],
      required: true,
      enum: [
        "clothes cleaning",
        "floor cleaning",
        "utensils cleaning",
        "cooking",
        "baby care",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "in-progress", "rejected"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: function () {
        return this.status === "completed";
      },
    },
    review: {
      type: String,
      required: function () {
        return this.status === "completed";
      },
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);

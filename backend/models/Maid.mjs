import mongoose from "mongoose";

const maidSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    salaryPerMonth: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "assigned"],
      default: "available",
    },
    availability: {
      type: String,
      required: true,
      enum: ["morning", "night", "full-day"],
    },
    services: {
      type: [
        {
          name: {
            type: String,
            required: true,
            enum: [
              "clothes cleaning",
              "floor cleaning",
              "utensils cleaning",
              "cooking",
              "baby care",
            ],
          },
          salary: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Maid", maidSchema);

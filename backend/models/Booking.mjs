import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    maidId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maid',
        required: true,
    },
    durationMonths : {
        type: Number,
        required: true,
    },
    startDate : {
        type: Date,
        required: true,
    },
    endDate : {
        type: Date,
        required: true,
    },
    availability: {
        type: String,
        required: true,
        enum: ['morning', 'night', 'full-day'],
    },
    services : {
        type: [String],
        required: true,
        enum: [
            'clothes cleaning',
            'floor cleaning',
            'utensils cleaning',
            'cooking',
            'baby care',
        ],
    },
    status : {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled' , 'completed'],
        default: 'pending',
    },
    totalAmount : {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Booking', bookingSchema);
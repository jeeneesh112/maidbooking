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
    // status : {
    //     type: String,
    //     enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    //     default: 'pending',
    // },
    totalAmount : {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Booking', bookingSchema);
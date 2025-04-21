import mongoose from 'mongoose';

const maidSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    mobile : {
        type: String,
        required: true,
        unique: true,
    },
    picture : {
        type: String,
        required: true,
    },
    state : {
        type: String,
        required: true,
    },
    city : {
        type: String,
        required: true,
    },
    area : {
        type: String,
        required: true,
    },
    pincode : {
        type: String,
        required: true,
    },
    salaryPerMonth : {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Maid', maidSchema);
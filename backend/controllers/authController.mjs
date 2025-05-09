import User from '../models/Users.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    const { name, email, mobile, password, city, area, state, pincode } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userBody = {
            name,
            email,
            mobile,
            password: hashedPassword,
            city,
            area,
            state,
            pincode,
        };

         await User.create(userBody);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    const { mobile, password } = req.body;
    const userData = await User.findOne({ mobile });

    if (!userData) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'OTP sent', userId: userData._id });
}

export const verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;

    if (otp !== '1234') return res.status(400).json({ message: 'Invalid OTP' });

    const userData = await User.findById(userId);

    console.log('User Data:', userData);

    const user = {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        city: userData.city,
        area: userData.area,
        state: userData.state,
        pincode: userData.pincode,
        pic: userData.pic,
        userType: userData.userType,
        roles: userData.roles,
    }

    const token = jwt.sign({ id: userData._id,
        userType : userData.userType,
        roles : userData.roles,
        name : userData.name,
     }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user });
}
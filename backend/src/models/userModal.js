import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    otp: Number,
    valid: Boolean,
    course_id: Number
}, { collection: 'users' });



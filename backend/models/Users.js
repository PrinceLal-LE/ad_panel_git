// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role_id: { type: Number, required: true },
    role_name: { type: String, required: true }
}, { timestamps: true });

// Renamed the model from 'User' to 'ad_users'
const User = mongoose.model('ad_users', userSchema);

module.exports = User;

// controllers/authController.js
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { Role } = require('../models/Roles'); // Import Role model to validate roles

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// User Registration
exports.register = async (req, res) => {
    const { email, password, role_id, role_name } = req.body;

    if (!email || !password || !role_id || !role_name) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // Check if the provided role_id and role_name are valid
        const validRole = await Role.findOne({ Role_id: role_id, Role_name: role_name });
        if (!validRole) {
            return res.status(400).json({ message: 'Invalid role selected.' });
        }

        // Hash password using Argon2id
        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

        const newUser = new User({
            email,
            password: hashedPassword,
            role_id,
            role_name
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password, role_id, role_name } = req.body;

    if (!email || !password || !role_id || !role_name) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Find user by email and selected role
        const user = await User.findOne({ email, role_id, role_name });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials or role.' });
        }

        // Verify password using Argon2
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials or role.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role_name: user.role_name },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                userId: user._id,
                email: user.email,
                role_name: user.role_name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

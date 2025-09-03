// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// JWT Authentication Middleware
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: 'Access Denied: No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Access Denied: Invalid token' });
        req.user = user; // Attach user payload to request
        next();
    });
};

// Role-based Authorization Middleware
exports.authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role_name) {
            return res.status(403).json({ message: 'Access Denied: User role not found' });
        }
        if (!allowedRoles.includes(req.user.role_name)) {
            return res.status(403).json({ message: 'Access Denied: Insufficient permissions' });
        }
        next();
    };
};

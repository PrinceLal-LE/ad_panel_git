// controllers/publicController.js
const { Role } = require('../models/Roles'); // Import Role model

// Function to get all roles (publicly accessible)
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({}, { _id: 0, Role_id: 1, Role_name: 1 }); // Fetch only Role_id and Role_name
        res.status(200).json({ roles });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Server error while fetching roles.' });
    }
};

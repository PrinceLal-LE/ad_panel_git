// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
// --- Protected Routes (REQUIRE AUTHENTICATION) ---
// All routes below this line will use authenticateToken and potentially authorizeRoles

// Route accessible by SuperAdmin only
router.get('/superadmin-data', authenticateToken, authorizeRoles(['SuperAdmin']), adminController.getSuperAdminData);

// Route accessible by Admin and SuperAdmin
router.get('/manage-users', authenticateToken, authorizeRoles(['SuperAdmin', 'Admin']), adminController.manageUsers);

// Route accessible by Editor, Admin, SuperAdmin
router.get('/content/edit', authenticateToken, authorizeRoles(['SuperAdmin', 'Admin', 'Editor']), adminController.editContent);

// Route accessible by Supervisor, Admin, SuperAdmin
router.get('/reports/view', authenticateToken, authorizeRoles(['SuperAdmin', 'Admin', 'Supervisior']), adminController.viewReports);

// Route accessible by all authenticated users
router.get('/user/profile', authenticateToken, adminController.getUserProfile);

module.exports = router;

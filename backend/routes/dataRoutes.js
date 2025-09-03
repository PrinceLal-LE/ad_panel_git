// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// All routes in this file will be protected by authentication.
// Further authorization can be added per route if needed (e.g., only Admin can delete).

// Create Data Item (e.g., Admin, Editor, SuperAdmin)
router.post('/', authenticateToken, authorizeRoles(['SuperAdmin', 'Admin']), dataController.createDataItem);

// Get All Data Items (e.g., All authenticated roles)
router.get('/', authenticateToken, dataController.getAllDataItems);

// Get Data Item by ID (e.g., All authenticated roles)
router.get('/:id', authenticateToken, dataController.getDataItemById);

// Update Data Item by ID (e.g., Admin, Editor, SuperAdmin)
router.put('/:id', authenticateToken, authorizeRoles(['SuperAdmin', 'Admin']), dataController.updateDataItem);

// Delete Data Item by ID (e.g., SuperAdmin, Admin)
router.delete('/:id', authenticateToken, authorizeRoles(['SuperAdmin', 'Admin']), dataController.deleteDataItem);

module.exports = router;

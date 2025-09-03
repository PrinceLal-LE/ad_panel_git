// routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Publicly accessible route to fetch all roles
router.get('/roles', publicController.getAllRoles);

module.exports = router;

// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    Role_id: { type: Number, required: true, unique: true },
    Role_name: { type: String, required: true, unique: true }
});

const Role = mongoose.model('ad_role', roleSchema);

// Function to pre-populate roles if they don't exist
async function initializeRoles() {
    const rolesData = [
        { Role_id: 1, Role_name: "SuperAdmin" },
        { Role_id: 2, Role_name: "Admin" },
        { Role_id: 3, Role_name: "Editor" },
        { Role_id: 4, Role_name: "Supervisior" }
    ];

    for (const role of rolesData) {
        try {
            await Role.findOneAndUpdate(
                { Role_id: role.Role_id },
                { $setOnInsert: role },
                { upsert: true, new: true }
            );
            console.log(`Role "${role.Role_name}" ensured.`);
        } catch (error) {
            console.error(`Error ensuring role "${role.Role_name}":`, error);
        }
    }
}

module.exports = { Role, initializeRoles };

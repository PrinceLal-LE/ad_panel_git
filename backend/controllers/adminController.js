// controllers/adminController.js

// Example: Get SuperAdmin specific data
exports.getSuperAdminData = (req, res) => {
    res.status(200).json({ message: `Welcome, SuperAdmin ${req.user.email}! This is highly sensitive data.` });
};

// Example: Manage Users (Admin and SuperAdmin)
exports.manageUsers = (req, res) => {
    res.status(200).json({ message: `Hello ${req.user.role_name} ${req.user.email}! You can manage users here.` });
};

// Example: Edit Content (Editor, Admin, SuperAdmin)
exports.editContent = (req, res) => {
    res.status(200).json({ message: `Hi ${req.user.role_name} ${req.user.email}! You can edit content.` });
};

// Example: View Reports (Supervisor, Admin, SuperAdmin)
exports.viewReports = (req, res) => {
    res.status(200).json({ message: `Greetings ${req.user.role_name} ${req.user.email}! Here are the reports.` });
};

// Example: User Profile (All authenticated users)
exports.getUserProfile = (req, res) => {
    res.status(200).json({ message: `Your profile, ${req.user.email}. Your role is ${req.user.role_name}.` });
};

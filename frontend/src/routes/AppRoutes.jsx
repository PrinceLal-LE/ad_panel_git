// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import authentication components
import RegisterPage from '../components/Auth/RegisterPage';
import LoginPage from '../components/Auth/LoginPage';
// import ForgotPasswordPage from '../components/Auth/ForgotPasswordPage';
import PostManagementPanel from '../components/PostManagement/PostManagementPanel';
// Import dashboard and layout components
import DashboardPage from '../components/Dashboard/DashboardPage';
import Layout from '../components/Layout/Layout';

// Import the new Data Management Page
import DataManagementPage from '../components/Data/DataManagementPage'; // NEW IMPORT

// Import authentication context and protected route HOC
import { useAuth } from '../AuthContext'; // Assuming useAuth is exported from App.js

// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, authReady } = useAuth();

    if (!authReady) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <p className="text-center lead">Loading authentication...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};


const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes (do NOT require the sidebar layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

            {/* Protected Routes (DO require the sidebar layout) */}
            <Route
                path="/dashboard/*" // Use a wildcard to match all sub-routes under /dashboard
                element={
                    <ProtectedRoute>
                        <Layout>
                            {/* Nested Routes for Dashboard content */}
                            <Routes>
                                <Route index element={<DashboardPage />} /> {/* Renders at /dashboard */}
                                <Route path="posts/:status" element={<PostManagementPanel />} />
                                {/* Data Sub-menu Routes */}
                                {/* Changed element to DataManagementPage */}
                                <Route path="data/all" element={<DataManagementPage />} />
                                <Route path="data/add" element={
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <h4>Add New Data Page (Alternative)</h4>
                                        <p>This page could also have a dedicated form, but the modal is integrated into DataManagementPage.</p>
                                    </div>
                                } />
                                {/* 'New' Submenu Routes under Data */}
                                <Route path="data/new/business" element={
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <h4>New Business Data</h4>
                                        <p>Manage new business-related data here.</p>
                                    </div>
                                } />
                                <Route path="data/new/project" element={
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <h4>New Project Data</h4>
                                        <p>Manage new project-related data here.</p>
                                    </div>
                                } />
                                <Route path="data/new/moulds" element={
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <h4>New Moulds Data</h4>
                                        <p>Manage new moulds-related data here.</p>
                                    </div>
                                } />

                                {/* User Management Sub-menu Routes */}
                                <Route path="users/list" element={
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <h4>User List Page</h4>
                                        <p>View and manage all users.</p>
                                    </div>
                                } />
                                <Route path="users/roles" element={
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <h4>Manage Roles Page</h4>
                                        <p>Assign and modify user roles.</p>
                                    </div>
                                } />

                                {/* Setting Sub-menu Routes */}
                                <Route path="setting/data" element={
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <h4>Setting Data Page</h4>
                                        <p>This is the data setting page.</p>
                                    </div>
                                } />

                                {/* Other Top-level Dashboard Routes */}
                                <Route path="content" element={
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <h4>Content Management Page</h4>
                                        <p>Create and edit content.</p>
                                    </div>
                                } />
                                <Route path="reports" element={
                                    <div className="p-3 bg-white rounded shadow-sm">
                                        <h4>Reports Page</h4>
                                        <p>View various reports.</p>
                                    </div>
                                } />
                                
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Redirect any unmatched routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

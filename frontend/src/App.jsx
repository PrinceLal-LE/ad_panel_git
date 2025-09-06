

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import { AuthProvider } from './AuthContext'; 
import CryptoJS from 'crypto-js';

// Import the new AppRoutes component
import AppRoutes from './routes/AppRoutes';

// Context for authentication and user data
// const AuthContext = createContext(null);


// Custom Modal Component (replaces alert/confirm) using React-Bootstrap Modal
export const CustomModal = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <Modal show={true} onHide={onClose} centered>
            <Modal.Body className="text-center">
                <p className="lead">{message}</p>
            </Modal.Body>
            <Modal.Footer className="justify-content-center border-0 pt-0">
                <button className="btn btn-primary" onClick={onClose}>
                    OK
                </button>
            </Modal.Footer>
        </Modal>
    );
};

// AuthProvider to manage authentication and provide context
// export const AuthProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const [userRole, setUserRole] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [authReady, setAuthReady] = useState(false);

//     // On initial load, check for stored authentication token and user data
//     useEffect(() => {
//         const storedToken = localStorage.getItem('authToken');
//         const storedRole = localStorage.getItem('userRole');
//         const storedUserId = localStorage.getItem('userId');

//         if (storedToken && storedRole && storedUserId) {
//             // In a real app, you'd ideally verify the token with the backend here for full security
//             // For this example, we'll assume it's valid if present
//             setCurrentUser({ userId: storedUserId, role_name: storedRole });
//             setUserRole(storedRole);
//             setIsAuthenticated(true);
//         }
//         setAuthReady(true); // Authentication state is ready after initial local storage check
//     }, []);

//     // Function to update user details after successful backend login
//     const loginUser = (userData, token) => {
//         setCurrentUser(userData);
//         setUserRole(userData.role_name);
//         setIsAuthenticated(true);
//         localStorage.setItem('authToken', token); // Store token
//         localStorage.setItem('userRole', userData.role_name); // Store role
//         localStorage.setItem('userId', userData.userId); // Store backend userId
//     };

//     // Function to clear user details on logout
//     const logoutUser = () => {
//         setCurrentUser(null);
//         setUserRole(null);
//         setIsAuthenticated(false);
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userId');
//     };

//     return (
//         <AuthContext.Provider value={{
//             currentUser,
//             userRole,
//             isAuthenticated,
//             loginUser,
//             logoutUser,
//             authReady,
//         }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Hook to use auth context
// export const useAuth = () => useContext(AuthContext);

// Main App Component
const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes /> {/* Render the AppRoutes component */}
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </AuthProvider>
        </Router>
    );
};

export default App;

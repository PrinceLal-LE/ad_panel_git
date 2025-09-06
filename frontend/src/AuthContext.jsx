// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
// Context for authentication and user data
const AuthContext = createContext(null);
const encryptKey = import.meta.env.VITE_ENCRYPT_KEY;

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, encryptKey).toString();
};

const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, encryptKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
// AuthProvider to manage authentication and provide context
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('fcn');

        if (storedToken && storedRole && storedUserId && storedEmail) {
            // Here you would add the logic to decrypt the user name.
            // For now, we'll assume the email is not encrypted.
            // Replace 'N/A' with the stored user email if it exists.
            try {
                const decryptedEmail = decryptData(storedEmail);
                if (decryptedEmail) {
                    setCurrentUser({ userId: storedUserId, role_name: storedRole, email: decryptedEmail });
                    setUserRole(storedRole);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Failed to decrypt user data:", error);
                // Handle decryption failure (e.g., clear local storage)
                localStorage.clear();
            }
        }
        setAuthReady(true);
    }, []);

    const loginUser = (userData, token) => {
        const encryptedEmail = encryptData(userData.email);
        setCurrentUser(userData);
        setUserRole(userData.role_name);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', userData.role_name);
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('fcn', encryptedEmail);
    };

    const logoutUser = () => {
        setCurrentUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('fcn');
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            userRole,
            isAuthenticated,
            loginUser,
            logoutUser,
            authReady,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
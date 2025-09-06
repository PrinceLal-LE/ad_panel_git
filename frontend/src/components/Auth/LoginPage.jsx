import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {  CustomModal } from '../../App';
import { useAuth } from '../../AuthContext';

const LoginPage = () => {
    const { loginUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [modalMessage, setModalMessage] = useState('');

    // Define the base URL for the backend API from environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Fetch roles from backend on component mount
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                console.log("fsdfsadfsad",API_BASE_URL);
                
                // const response = await fetch(`${API_BASE_URL}/api/roles`); // Use environment variable
                const response = await fetch(`${API_BASE_URL}/api/roles`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                console.log("response",response);
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setRoles(data.roles);
                } else {
                    setModalMessage(data.message || 'Failed to fetch roles.');
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
                setModalMessage('Network error: Could not connect to role service.');
            } finally {
                setLoadingRoles(false);
            }
        };
        fetchRoles();
    }, [API_BASE_URL]); // Add API_BASE_URL to dependency array

    // If already authenticated, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            setModalMessage('Please select your role.');
            return;
        }

        const role = roles.find(r => r.Role_name === selectedRole);
        if (!role) {
            setModalMessage('Invalid role selected.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, { // Use environment variable
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role_id: role.Role_id, role_name: role.Role_name }),
            });

            const data = await response.json();

            if (response.ok) {
                loginUser(data.user, data.token);
                navigate('/dashboard', { replace: true });
            } else {
                setModalMessage(data.message || 'Login failed. Check your credentials and role.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setModalMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <CustomModal message={modalMessage} onClose={() => setModalMessage('')} />
            <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
                <Card.Title as="h2" className="text-center mb-4">Sign In</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmailLogin">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPasswordLogin">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicRoleLogin">
                        <Form.Label>Your Role</Form.Label>
                        {loadingRoles ? (
                            <div className="text-center">
                                <Spinner animation="border" size="sm" role="status">
                                    <span className="visually-hidden">Loading roles...</span>
                                </Spinner>
                                <span className="ms-2">Loading roles...</span>
                            </div>
                        ) : (
                            <Form.Select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                required
                                disabled={roles.length === 0}
                            >
                                <option value="">-- Select Your Role --</option>
                                {roles.map((role) => (
                                    <option key={role.Role_id} value={role.Role_name}>
                                        {role.Role_name}
                                    </option>
                                ))}
                            </Form.Select>
                        )}
                        {roles.length === 0 && !loadingRoles && (
                            <Form.Text className="text-danger">
                                No roles available. Please check backend.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loadingRoles || roles.length === 0}>
                        Sign In
                    </Button>
                </Form>
                <p className="text-center mt-3">
                    Don't have an account?{' '}
                    <Button variant="link" onClick={() => navigate('/register')} className="p-0">
                        Register
                    </Button>
                </p>
            </Card>
        </div>
    );
};

export default LoginPage;

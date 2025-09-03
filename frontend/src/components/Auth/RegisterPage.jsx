import React, { useState } from 'react';
import {  Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { CustomModal } from '../../App.jsx';

const RegisterPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const roles = [
        { Role_id: 1, Role_name: "SuperAdmin" },
        { Role_id: 2, Role_name: "Admin" },
        { Role_id: 3, Role_name: "Editor" },
        { Role_id: 4, Role_name: "Supervisior" },
        { Role_id: 5, Role_name: "User" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            setModalMessage('Please select a role.');
            return;
        }

        const role = roles.find(r => r.Role_name === selectedRole);
        if (!role) {
            setModalMessage('Invalid role selected.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role_id: role.Role_id, role_name: role.Role_name }),
            });

            const data = await response.json();

            if (response.ok) {
                setModalMessage(data.message || 'Registration successful!');
                navigate('/login'); // Use navigate for redirection
            } else {
                setModalMessage(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setModalMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Modal message={modalMessage} onClose={() => setModalMessage('')} />
            <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
                <Card.Title as="h2" className="text-center mb-4">Register</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicRole">
                        <Form.Label>Select Role</Form.Label>
                        <Form.Select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            required
                        >
                            <option value="">-- Choose a Role --</option>
                            {roles.map((role) => (
                                <option key={role.Role_id} value={role.Role_name}>
                                    {role.Role_name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-3">
                        Register
                    </Button>
                </Form>
                <p className="text-center mt-3">
                    Already have an account?{' '}
                    <Button variant="link" onClick={() => navigate('/login')} className="p-0">
                        Sign In
                    </Button>
                </p>
            </Card>
        </div>
    );
};

export default RegisterPage;

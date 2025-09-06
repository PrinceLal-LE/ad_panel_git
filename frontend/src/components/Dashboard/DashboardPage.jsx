import React, { useEffect, useState } from 'react';
import {  Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CustomModal } from '../../App';
import { useAuth } from '../../AuthContext';
import { SuperAdminPanel, AdminPanel, EditorPanel, SupervisorPanel, UserPanel } from './Panels';

const DashboardPage = () => {
    const { currentUser, userRole, isAuthenticated, logoutUser, authReady } = useAuth(); // Removed canvasUserId
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        // If not authenticated and auth check is ready, redirect to login
        if (authReady && !isAuthenticated) {
            setModalMessage('You need to be logged in to access the dashboard.');
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, authReady, navigate]);

    // This check is primarily for initial render before useEffect fires
    if (!isAuthenticated && authReady) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <CustomModal message={modalMessage} onClose={() => setModalMessage('')} />
                <p className="text-center lead">Redirecting to login...</p>
            </div>
        );
    }

    // Render a loading state while authentication status is being determined
    if (!authReady) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <p className="text-center lead">Loading authentication status...</p>
            </div>
        );
    }

    const handleLogout = () => {
        logoutUser();
        navigate('/login', { replace: true });
    };

    const renderPanel = () => {
        switch (userRole) {
            case 'SuperAdmin':
                return <SuperAdminPanel />;
            case 'Admin':
                return <AdminPanel />;
            case 'Editor':
                return <EditorPanel />;
            case 'Supervisior':
                return <SupervisorPanel />;
            case 'User':
                return <UserPanel />;
            default:
                return (
                    <Card className="text-center p-4 shadow-lg">
                        <Card.Body>
                            <Card.Title as="h3">Welcome to the Dashboard!</Card.Title>
                            <Card.Text>Your role is not recognized or not set.</Card.Text>
                        </Card.Body>
                    </Card>
                );
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-light p-2 w-100">
            <CustomModal message={modalMessage} onClose={() => setModalMessage('')} />
            <Card className="p-4 w-100 rounded-end" style={{ maxWidth: '100%' }}>
                <Card.Title as="h2" className="text-center mb-4">Admin Panel</Card.Title>
                <Row className="mb-4 pb-3 border-bottom align-items-center">
                    <Col>
                        <p className="mb-0">
                            Logged in as: <span className="fw-bold text-primary">{currentUser?.email || 'N/A'}</span>
                        </p>
                    </Col>
                    <Col className="text-center">
                        <p className="mb-0">
                            Your Role: <span className="fw-bold text-primary">{userRole || 'N/A'}</span>
                        </p>
                    </Col>
                    <Col className="text-end">
                        <Button variant="danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Col>
                </Row>
                {renderPanel()}
            </Card>
        </div>
    );
};

export default DashboardPage;



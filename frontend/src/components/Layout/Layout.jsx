import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Button, Card } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import SidebarWrapper from './SidebarWrapper';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { currentUser, userRole, isAuthenticated, logoutUser } = useAuth();
    const navigate = useNavigate();
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    const handleToggleMobileSidebar = () => setShowMobileSidebar(!showMobileSidebar);
    const handleLogout = () => {
        logoutUser();
        navigate('/login', { replace: true });
    };

    if (!isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* Navbar for mobile toggle (always visible on small screens when authenticated) */}
            <Navbar bg="dark" variant="dark" expand="md" className="d-md-none">
                <Container fluid>
                    <Navbar.Brand href="#">Admin Panel</Navbar.Brand>
                    <Button variant="dark" onClick={handleToggleMobileSidebar} className="text-white">
                        <FaBars />
                    </Button>
                </Container>
            </Navbar>

            {/* Main content area using flexbox to arrange sidebar and main content */}
            <div className="d-flex flex-grow-1">
                {/* Sidebar (rendered by SidebarWrapper, which handles desktop vs. mobile offcanvas) */}
                <SidebarWrapper
                    showMobileSidebar={showMobileSidebar}
                    handleCloseMobileSidebar={handleToggleMobileSidebar}
                />

                {/* Main Content Area */}
                {/* Added overflow-auto to allow internal scrolling if content overflows, preventing body overflow */}
                <div className="flex-grow-1 p-3 overflow-auto">
                    {/* User Info and Logout Bar - Consistently at the top of the main content area */}
                    <Card className="p-4 shadow-lg mb-4">
                        <Row className="align-items-center">
                            <Col xs={12} md={6}>
                                <p className="mb-0 text-break"> {/* Added text-break */}
                                    Logged in as: <span className="fw-bold text-primary">{currentUser?.email || 'N/A'}</span>
                                </p>
                            </Col>
                            <Col xs={12} md={3} className="text-md-center mt-2 mt-md-0">
                                <p className="mb-0">
                                    Your Role: <span className="fw-bold text-primary">{userRole || 'N/A'}</span>
                                </p>
                            </Col>
                            <Col xs={12} md={3} className="text-md-end mt-2 mt-md-0">
                                <Button variant="danger" onClick={handleLogout} className="w-100 w-md-auto">
                                    Logout
                                </Button>
                            </Col>
                        </Row>
                    </Card>

                    {children} {/* This is where the actual page content (DashboardPage, DataPage, etc.) will render */}
                </div>
            </div>
        </div>
    );
};

export default Layout;

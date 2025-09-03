// src/components/Layout/SidebarWrapper.jsx
import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import Sidebar from './Sidebar'; // Import the Sidebar component

const SidebarWrapper = ({ showMobileSidebar, handleCloseMobileSidebar }) => {
    // State to track if the view is desktop (>= md breakpoint, 768px)
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    // Effect to update isDesktop state on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Desktop Sidebar: Only render if it's a desktop view */}
            {isDesktop && (
                <div className="bg-dark text-white p-3" style={{ width: '15%', flexShrink: 0 }}>
                    <Sidebar />
                </div>
            )}

            {/* Mobile Offcanvas Sidebar: Only render if it's NOT a desktop view */}
            {!isDesktop && (
                <Offcanvas show={showMobileSidebar} onHide={handleCloseMobileSidebar} placement="start" className="bg-dark text-white">
                    <Offcanvas.Header closeButton closeVariant="white">
                        <Offcanvas.Title>Admin Menu</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="p-0">
                        <Sidebar show={true} /> {/* Pass show prop to ensure it renders correctly in offcanvas */}
                    </Offcanvas.Body>
                </Offcanvas>
            )}
        </>
    );
};

export default SidebarWrapper;

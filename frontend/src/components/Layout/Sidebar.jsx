import React, { useState } from 'react';
import { Nav, Collapse } from 'react-bootstrap'; // Import Collapse for sub-menu
import { NavLink, useLocation } from 'react-router-dom'; // Import NavLink and useLocation
import { FaDatabase, FaTachometerAlt, FaUsers, FaEdit, FaChartLine, FaChevronRight, FaChevronDown, FaCog, FaThumbtack } from 'react-icons/fa'; // Added FaCog for Setting icon
import { useAuth } from '../../AuthContext';

const Sidebar = () => {
    const { currentUser } = useAuth();
    const location = useLocation(); // Hook to get current URL location

    // State for collapse open/close for each menu item
    const [openData, setOpenData] = useState(false);
    const [openUserManagement, setOpenUserManagement] = useState(false);
    const [openSetting, setOpenSetting] = useState(false); // NEW: State for Setting menu
    const [openPost, setOpenPost] = useState(false); // NEW: State for Post menu
    // Function to check if a parent menu or any of its sub-menus are active
    const isParentActive = (paths) => {
        return paths.some(path => location.pathname.startsWith(path));
    };

    // Custom NavLink component for consistent styling and active state
    const CustomNavLink = ({ to, children, icon: Icon, isSubMenu = false }) => {
        const isActive = location.pathname === to;
        const activeClass = isActive ? ' active-link fw-bold' : '';
        const subMenuClass = isSubMenu ? 'ms-3' : ''; // Indent sub-menu items

        return (
            <NavLink
                to={to}
                className={`nav-link text-white py-2 ${subMenuClass}${activeClass}`}
            >
                {Icon && <Icon className="me-2" />}
                {children}
            </NavLink>
        );
    };

    return (
        <div className="sidebar bg-dark text-white p-0 d-flex flex-column h-100">
            <div className="text-center mb-0">
                <h3 className="text-white m-0">Admin Panel</h3>
            </div>
            <hr className="bg-secondary m-2" />
            <Nav className="flex-column flex-grow-1"> {/* flex-grow-1 to push content down */}
                <div className="d-flex flex-column align-items-center mb-0 text-center">
                    <img
                        src="https://placehold.co/50x50/8a2be2/ffffff?text=DG"
                        alt="User Avatar"
                        className="rounded-circle mb-2"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div>
                        <h6 className="mb-0">{currentUser?.email || 'Guest User'}</h6>
                        <small className="text-secondary">{currentUser?.role_name || 'N/A'}</small>
                    </div>
                </div>
                <hr className="bg-secondary m-1" />

                <CustomNavLink to="/dashboard" icon={FaTachometerAlt}>
                    Dashboard
                </CustomNavLink>

                {/* Data Menu with Sub-menu */}
                <Nav.Link
                    onClick={() => setOpenData(!openData)}
                    aria-controls="data-submenu"
                    aria-expanded={openData}
                    className={`text-white py-2 d-flex justify-content-between align-items-center ${isParentActive(['/dashboard/data']) ? 'active-parent-link' : ''}`}
                >
                    <div>
                        <FaDatabase className="me-2" />
                        Data
                    </div>
                    {openData ? <FaChevronDown /> : <FaChevronRight />}
                </Nav.Link>
                <Collapse in={openData}>
                    <div id="data-submenu">
                        <CustomNavLink to="/dashboard/data/all" isSubMenu={true}>All Data</CustomNavLink>
                        <CustomNavLink to="/dashboard/data/add" isSubMenu={true}>Add New Data</CustomNavLink>
                        {/* Add more data sub-menus */}
                    </div>
                </Collapse>
                <Nav.Link
                    onClick={() => setOpenPost(!openPost)}
                    aria-controls="post-submenu"
                    aria-expanded={openPost}
                    className={`text-white py-2 d-flex justify-content-between align-items-center ${isParentActive(['/dashboard/posts']) ? 'active-parent-link' : ''}`}
                >
                    <div>
                        <FaThumbtack className="me-2" />
                        Post
                    </div>
                    {openPost ? <FaChevronDown /> : <FaChevronRight />}
                </Nav.Link>
                <Collapse in={openPost}>
                    <div id="post-submenu">
                        <CustomNavLink to="/dashboard/posts/pending" isSubMenu={true}>To Be Approved</CustomNavLink>
                        <CustomNavLink to="/dashboard/posts/approved" isSubMenu={true}>Approved Post</CustomNavLink>
                        <CustomNavLink to="/dashboard/posts/rejected" isSubMenu={true}>Rejected Post</CustomNavLink>
                        <CustomNavLink to="/dashboard/posts/deleted" isSubMenu={true}>Deleted Post</CustomNavLink>
                    </div>
                </Collapse>

                {/* User Management Menu with Sub-menu */}
                <Nav.Link
                    onClick={() => setOpenUserManagement(!openUserManagement)}
                    aria-controls="user-management-submenu"
                    aria-expanded={openUserManagement}
                    className={`text-white py-2 d-flex justify-content-between align-items-center ${isParentActive(['/dashboard/users']) ? 'active-parent-link' : ''}`}
                >
                    <div>
                        <FaUsers className="me-2" />
                        User Management
                    </div>
                    {openUserManagement ? <FaChevronDown /> : <FaChevronRight />}
                </Nav.Link>
                <Collapse in={openUserManagement}>
                    <div id="user-management-submenu">
                        <CustomNavLink to="/dashboard/users/list" isSubMenu={true}>User List</CustomNavLink>
                        <CustomNavLink to="/dashboard/users/roles" isSubMenu={true}>Manage Roles</CustomNavLink>
                    </div>
                </Collapse>

                {/* NEW: Setting Menu with Sub-menu */}
                <Nav.Link
                    onClick={() => setOpenSetting(!openSetting)}
                    aria-controls="setting-submenu"
                    aria-expanded={openSetting}
                    className={`text-white py-2 d-flex justify-content-between align-items-center ${isParentActive(['/dashboard/setting']) ? 'active-parent-link' : ''}`}
                >
                    <div>
                        <FaCog className="me-2" />
                        Setting
                    </div>
                    {openSetting ? <FaChevronDown /> : <FaChevronRight />}
                </Nav.Link>
                <Collapse in={openSetting}>
                    <div id="setting-submenu">
                        <CustomNavLink to="/dashboard/setting/data" isSubMenu={true}>Data</CustomNavLink>
                        {/* Add more setting sub-menus here if needed */}
                    </div>
                </Collapse>

                {/* Other Menu Options (Simple Links) */}
                <CustomNavLink to="/dashboard/content" icon={FaEdit}>
                    Content
                </CustomNavLink>
                <CustomNavLink to="/dashboard/reports" icon={FaChartLine}>
                    Reports
                </CustomNavLink>
                {/* Add more links here as needed */}
            </Nav>
            {/* Optional: Push a footer to the bottom of the sidebar */}
            <div className="mt-auto text-center pt-2 pb-1 border-top border-secondary">
                <small className="text-secondary">&copy; 2025 Admin Panel</small>
            </div>
        </div>
    );
};

export default Sidebar;

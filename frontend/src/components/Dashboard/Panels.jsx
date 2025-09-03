import React from 'react';
import { Card } from 'react-bootstrap';

export const SuperAdminPanel = () => (
    <Card bg="dark" text="white" className="text-center p-4 shadow-lg">
        <Card.Body>
            <Card.Title as="h3">Super Admin Dashboard</Card.Title>
            <Card.Text>Full control over all system settings and user management.</Card.Text>
            <Card.Text className="text-muted small">This is the highest level of access.</Card.Text>
        </Card.Body>
    </Card>
);

export const AdminPanel = () => (
    <Card bg="primary" text="white" className="text-center p-4 shadow-lg">
        <Card.Body>
            <Card.Title as="h3">Admin Dashboard</Card.Title>
            <Card.Text>Manage users, content, and application settings.</Card.Text>
            <Card.Text className="text-muted small">You have significant administrative privileges.</Card.Text>
        </Card.Body>
    </Card>
);

export const EditorPanel = () => (
    <Card bg="success" text="white" className="text-center p-4 shadow-lg">
        <Card.Body>
            <Card.Title as="h3">Editor Dashboard</Card.Title>
            <Card.Text>Create, edit, and publish content.</Card.Text>
            <Card.Text className="text-muted small">Focus on content management.</Card.Text>
        </Card.Body>
    </Card>
);

export const SupervisorPanel = () => (
    <Card bg="warning" text="dark" className="text-center p-4 shadow-lg">
        <Card.Body>
            <Card.Title as="h3">Supervisor Dashboard</Card.Title>
            <Card.Text>Oversee team activities and review content.</Card.Text>
            <Card.Text className="text-muted small">Monitor and guide the team.</Card.Text>
        </Card.Body>
    </Card>
);

export const UserPanel = () => (
    <Card bg="secondary" text="white" className="text-center p-4 shadow-lg">
        <Card.Body>
            <Card.Title as="h3">User Dashboard</Card.Title>
            <Card.Text>Access your personalized content and profile.</Card.Text>
            <Card.Text className="text-muted small">Welcome to your personal space!</Card.Text>
        </Card.Body>
    </Card>
);

import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

const ForgotPasswordPage = ({ navigate }) => {
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
                <Card.Title as="h2" className="text-center mb-4">Forgot Password?</Card.Title>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmailReset">
                        <Form.Label>Enter your email address</Form.Label>
                        <Form.Control type="email" placeholder="Email" required />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mt-3">
                        Reset Password
                    </Button>
                </Form>
                <p className="text-center mt-3">
                    Remembered your password?{' '}
                    <Button variant="link" onClick={() => navigate('login')} className="p-0">
                        Sign In
                    </Button>
                </p>
            </Card>
        </Container>
    );
};

export default ForgotPasswordPage;

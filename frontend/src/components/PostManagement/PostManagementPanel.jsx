// frontend/src/components/PostManagementPanel.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostManagementPanel = ({ status }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userRole, token } = useAuth();
    const navigate = useNavigate();

    const isSuperAdmin = userRole === 'SuperAdmin';
    const isEditor = userRole === 'Editor';

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const endpoint = `${status}-posts`;
            const response = await fetch(`${API_BASE_URL}/api/admin/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch ${status} posts.`);
            }
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPosts();
        }
    }, [token, status]);

    const handleAction = async (postId, action) => {
        let endpoint = '';
        let method = 'PUT';

        if (action === 'approve') {
            endpoint = `approve-post/${postId}`;
        } else if (action === 'reject') {
            endpoint = `reject-post/${postId}`;
        } else if (action === 'soft-delete') {
            endpoint = `posts/soft-delete/${postId}`;
        } else if (action === 'permanent-delete') {
            endpoint = `posts/permanent-delete/${postId}`;
            method = 'DELETE';
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            
            Swal.fire('Success!', `Post ${action}d successfully.`, 'success');
            setPosts(posts.filter(post => post._id !== postId));
        } catch (err) {
            Swal.fire('Error!', err.message, 'error');
            setError(`Error: ${err.message}`);
        }
    };

    const handleRestorePost = async (postId) => {
      try {
          const response = await fetch(`${API_BASE_URL}/api/admin/posts/restore/${postId}`, {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message);
          }
          Swal.fire('Success!', 'Post restored successfully.', 'success');
          setPosts(posts.filter(post => post._id !== postId));
      } catch (err) {
          Swal.fire('Error!', err.message, 'error');
      }
    };

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger" className="mt-5">{error}</Alert>;
    }

    if (posts.length === 0) {
        return <Alert variant="info" className="mt-5">No {status} posts to display.</Alert>;
    }

    return (
        <Card className="mt-4">
            <Card.Header>
                <h4 className="mb-0">{status.charAt(0).toUpperCase() + status.slice(1)} Posts</h4>
            </Card.Header>
            <Card.Body>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Post Title</th>
                            <th>Submitted On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post._id}>
                                <td>{post.user?.userId}</td>
                                <td>{post.title}</td>
                                <td>{moment(post.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                <td>
                                    {status === 'pending' && (
                                        <>
                                            <Button variant="success" className="me-2" onClick={() => handleAction(post._id, 'approve')}>Approve</Button>
                                            <Button variant="danger" onClick={() => handleAction(post._id, 'reject')}>Reject</Button>
                                        </>
                                    )}
                                    {status === 'approved' && (
                                        <>
                                            <Button variant="danger" className="me-2" onClick={() => handleAction(post._id, 'reject')}>Reject</Button>
                                            {(isEditor || isSuperAdmin) && (
                                                <Button variant="secondary" onClick={() => handleAction(post._id, 'soft-delete')}>Soft Delete</Button>
                                            )}
                                        </>
                                    )}
                                    {status === 'rejected' && (
                                        <>
                                            <Button variant="success" className="me-2" onClick={() => handleAction(post._id, 'approve')}>Approve</Button>
                                            {(isEditor || isSuperAdmin) && (
                                                <Button variant="secondary" onClick={() => handleAction(post._id, 'soft-delete')}>Soft Delete</Button>
                                            )}
                                        </>
                                    )}
                                    {status === 'deleted' && (
                                        <>
                                            <Button variant="warning" className="me-2" onClick={() => handleRestorePost(post._id)}>Restore</Button>
                                            {isSuperAdmin && (
                                                <Button variant="danger" onClick={() => handleAction(post._id, 'permanent-delete')}>Permanent Delete</Button>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default PostManagementPanel;
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Button, Table, Spinner, Modal as BootstrapModal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../App'; // No longer importing custom Modal
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { toast } from 'react-toastify'; // Import toast for notifications

const DataManagementPage = () => {
    const { isAuthenticated } = useAuth();
    const [dataItems, setDataItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [currentDataItem, setCurrentDataItem] = useState(null);
    const [formOption, setFormOption] = useState('');
    const [formSuboption, setFormSuboption] = useState(''); // comma-separated string
    const [formDescription, setFormDescription] = useState('');
    // modalMessage state is no longer needed as toast is used

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchDataItems = useCallback(async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/data`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setDataItems(data.dataItems);
                const uniqueOptions = [...new Set(data.dataItems.map(item => item.option))];
                setAvailableOptions(uniqueOptions.filter(Boolean));
            } else {
                setError(data.message || 'Failed to fetch data items.');
                toast.error(data.message || 'Failed to fetch data items.');
            }
        } catch (err) {
            console.error('Error fetching data items:', err);
            setError('Network error: Could not fetch data items.');
            toast.error('Network error: Could not fetch data items.');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, API_BASE_URL]);

    const [availableOptions, setAvailableOptions] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDataItems();
        }
    }, [isAuthenticated, fetchDataItems]);

    const handleAddClick = () => {
        setCurrentDataItem(null);
        setFormOption('');
        setFormSuboption('');
        setFormDescription('');
        setShowFormModal(true);
    };

    const handleEditClick = (item) => {
        setCurrentDataItem(item);
        setFormOption(item.option);
        setFormSuboption(item.suboption ? item.suboption.join(', ') : '');
        setFormDescription(item.description || '');
        setShowFormModal(true);
    };

    const handleDeleteClick = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`${API_BASE_URL}/api/data/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        toast.success(data.message);
                        fetchDataItems();
                    } else {
                        toast.error(data.message || 'Failed to delete item.');
                    }
                } catch (err) {
                    console.error('Error deleting data item:', err);
                    toast.error('Network error: Could not delete item.');
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        let method = 'POST';
        let url = `${API_BASE_URL}/api/data`;

        const suboptionArray = formSuboption.split(',').map(s => s.trim()).filter(s => s !== '');

        const payload = {
            option: formOption,
            suboption: suboptionArray,
            description: formDescription.trim() === '' ? null : formDescription
        };

        if (currentDataItem) {
            method = 'PUT';
            url = `${API_BASE_URL}/api/data/${currentDataItem._id}`;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setShowFormModal(false);
                fetchDataItems();
            } else {
                toast.error(data.message || `Failed to ${currentDataItem ? 'update' : 'create'} item.`);
            }
        } catch (err) {
            console.error(`Error ${currentDataItem ? 'updating' : 'creating'} data item:`, err);
            toast.error(`Network error: Could not ${currentDataItem ? 'update' : 'create'} item.`);
        }
    };

    return (
        <Container fluid className="p-0">
            <Card className="p-4 shadow-lg mb-4">
                {/* Modified flex container for responsiveness */}
                <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-3">
                    <Card.Title as="h4" className="mb-2 mb-md-0">Data Management</Card.Title> {/* Adjusted margin for mobile */}
                    <Button variant="primary" size="sm" onClick={handleAddClick} className="d-flex align-items-center mt-2 mt-md-0"> {/* Adjusted margin for mobile */}
                        <FaPlus className="me-1" /> Add New Data Item
                    </Button>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-2">Loading data items...</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Option</th>
                                    <th>Sub-options</th>
                                    <th>Description</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataItems.length > 0 ? (
                                    dataItems.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td className="text-break">{item.option}</td>
                                            <td className="text-break">{item.suboption && item.suboption.length > 0 ? item.suboption.join(', ') : 'N/A'}</td>
                                            <td className="text-break">{item.description || 'N/A'}</td>
                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(item)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(item._id)}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center"> {/* Use colSpan to span all 6 columns */}
                                            No data items found. Click "Add New Data Item" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card>

            {/* Add/Edit Data Item Modal */}
            <BootstrapModal show={showFormModal} onHide={() => setShowFormModal(false)} centered>
                <BootstrapModal.Header closeButton>
                    <BootstrapModal.Title>{currentDataItem ? 'Edit Data Item' : 'Add New Data Item'}</BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formOption">
                            <Form.Label>Option</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Option (e.g., New, Resale)"
                                value={formOption}
                                onChange={(e) => setFormOption(e.target.value)}
                                required
                                list="availableOptionsList"
                            />
                            <datalist id="availableOptionsList">
                                {availableOptions.map((opt, index) => (
                                    <option key={index} value={opt} />
                                ))}
                            </datalist>
                            <Form.Text className="text-muted">
                                Type a new option or select from existing ones.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formSuboption">
                            <Form.Label>Sub-options (comma-separated)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Business, Project, Moulds"
                                value={formSuboption}
                                onChange={(e) => setFormSuboption(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                Enter multiple sub-options separated by commas.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description (optional)"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            {currentDataItem ? 'Update Item' : 'Add Item'}
                        </Button>
                    </Form>
                </BootstrapModal.Body>
            </BootstrapModal>
        </Container>
    );
};

export default DataManagementPage;

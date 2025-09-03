// controllers/dataController.js
const DataItem = require('../models/DataItem'); // Import the DataItem model

// Create a new data item
exports.createDataItem = async (req, res) => {
    const { option, suboption, description } = req.body;

    if (!option) {
        return res.status(400).json({ message: 'Option is required.' });
    }

    // Ensure suboption is an array, even if empty or single string
    const suboptionArray = Array.isArray(suboption) ? suboption :
                           (typeof suboption === 'string' && suboption.trim() !== '') ? suboption.split(',').map(s => s.trim()) : [];

    try {
        const newDataItem = new DataItem({
            option,
            suboption: suboptionArray,
            description,
            createdBy: req.user ? req.user.userId : null // Assuming req.user is set by auth middleware
        });
        await newDataItem.save();
        res.status(201).json({ message: 'Data item created successfully!', dataItem: newDataItem });
    } catch (error) {
        console.error('Error creating data item:', error);
        res.status(500).json({ message: 'Server error while creating data item.' });
    }
};

// Get all data items
exports.getAllDataItems = async (req, res) => {
    try {
        const dataItems = await DataItem.find({});
        res.status(200).json({ dataItems });
    } catch (error) {
        console.error('Error fetching data items:', error);
        res.status(500).json({ message: 'Server error while fetching data items.' });
    }
};

// Get a single data item by ID
exports.getDataItemById = async (req, res) => {
    try {
        const dataItem = await DataItem.findById(req.params.id);
        if (!dataItem) {
            return res.status(404).json({ message: 'Data item not found.' });
        }
        res.status(200).json({ dataItem });
    } catch (error) {
        console.error('Error fetching data item by ID:', error);
        res.status(500).json({ message: 'Server error while fetching data item.' });
    }
};

// Update a data item by ID
exports.updateDataItem = async (req, res) => {
    const { option, suboption, description } = req.body;

    // Ensure suboption is an array
    const suboptionArray = Array.isArray(suboption) ? suboption :
                           (typeof suboption === 'string' && suboption.trim() !== '') ? suboption.split(',').map(s => s.trim()) : [];

    try {
        const dataItem = await DataItem.findById(req.params.id);
        if (!dataItem) {
            return res.status(404).json({ message: 'Data item not found.' });
        }

        dataItem.option = option || dataItem.option;
        dataItem.suboption = suboptionArray; // Always update suboption with the new array
        dataItem.description = description !== undefined ? description : dataItem.description; // Allow description to be explicitly null/empty
        dataItem.updatedBy = req.user ? req.user.userId : null; // Assuming req.user is set by auth middleware

        await dataItem.save();
        res.status(200).json({ message: 'Data item updated successfully!', dataItem });
    } catch (error) {
        console.error('Error updating data item:', error);
        res.status(500).json({ message: 'Server error while updating data item.' });
    }
};

// Delete a data item by ID
exports.deleteDataItem = async (req, res) => {
    try {
        const dataItem = await DataItem.findByIdAndDelete(req.params.id);
        if (!dataItem) {
            return res.status(404).json({ message: 'Data item not found.' });
        }
        res.status(200).json({ message: 'Data item deleted successfully!' });
    } catch (error) {
        console.error('Error deleting data item:', error);
        res.status(500).json({ message: 'Server error while deleting data item.' });
    }
};

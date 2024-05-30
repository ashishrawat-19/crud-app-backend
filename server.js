const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
// "mongodb+srv://devcluster.ksxluq0.mongodb.net/" --apiVersion 1 --username ashishrawat23 --password ashishrawat
mongoose.connect('mongodb+srv://devcluster.ksxluq0.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
        user: 'ashishrawat23',
        password: 'ashishrawat'
    }
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Define a schema for the Record model
const recordSchema = new mongoose.Schema({
    // Define fields for the Record model
    // Example:
    name: String,
    Designation: String,
    Experience: Number
});

// Create the Record model
const Record = mongoose.model('posts', recordSchema);

// Define a route to get records count
app.get('/api/records/count', async (req, res) => {
    try {
        // Fetch count of records from the MongoDB collection
        const count = await Record.estimatedDocumentCount();
        console.log('Record count:', count);
        res.json({ count });
    } catch (error) {
        console.error('Error fetching record count:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Define a route to fetch all records
app.get('/api/records', async (req, res) => {
    try {
        // Fetch all records from the MongoDB collection
        // const records = await Record.find({}, { _id: 0 });
        const records = await Record.find();
        res.json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Define a route to fetch all posts from the "posts" collection
app.get('/api/posts', async (req, res) => {
    try {
        // Fetch all records from the "posts" collection
        // const posts = await Record.find({}, { _id: 0 }); // Exclude _id field from the response
        const posts = await Record.find();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// Define a route to fetch all posts from the "posts" collection
app.post('/api/submitRecords', async (req, res) => {
    try {
        // Create a new record using the request body
        const newRecord = await Record.create(req.body);
        res.json("Submitted Successfully!!");
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


app.post('/api/updateInfo', async (req, res) => {
    try {
        // Create a new record using the request body
        const updateRecord = await Record.updateOne({ name: req.body.name }, { $set: { Designation: req.body.Designation, Experience: req.body.Experience } });
        res.json("Updated Successfully!!");
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.put('/api/updateInfo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, Designation, Experience } = req.body;
        
        // Update the record using the ID from the URL parameters
        const updateResult = await Record.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            { $set: { name, Designation, Experience } }
        );

        if (updateResult.nModified === 0) {
            res.status(404).json({ message: 'Record not found or no changes made' });
        } else {
            res.json({ message: 'Updated Successfully!!' });
        }
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


app.delete('/api/deleteInfo/:id' , async (req, res) => {
    try {
        // Create a new record using the request body
        const deleteRecord = await Record.deleteOne({ _id: req.params.id });
        res.json("Deleted Successfully!!");
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

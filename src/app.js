require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Company = require('./models/company'); // Replace with your actual model path
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Remove the useFindAndModify option
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Route to get all companies
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to search for a company by name
app.get('/api/companies/search', async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) {
      return res.status(400).json({ message: 'Name query parameter is required' });
    }
    const companies = await Company.find({ name: { $regex: new RegExp(name, 'i') } });
    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

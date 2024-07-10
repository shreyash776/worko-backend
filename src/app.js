require('dotenv').config();
const express = require('express');// Replace with your actual model path
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const Company = require('./models/company');

const data = require('./data.json');



// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Route to get all companies
app.get('/api/companies', async (req, res) => {
  try {
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to search for a company by name
// app.get('/api/companies/search', async (req, res) => {
//   try {
//     const name = req.query.name;
//     if (!name) {
//       return res.status(400).json({ message: 'Name query parameter is required' });
//     }
//     const companies = await Company.find({ name: { $regex: new RegExp(name, 'i') } });
//     res.json(companies);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });


app.get('/api/companies/search', async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) {
      return res.status(400).json({ message: 'Name query parameter is required' });
    }

    // Filter companies based on the name (case insensitive search)
    const companies = data.filter(company =>
      company.name.toLowerCase().includes(name.toLowerCase())
    );

    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});



app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// index.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const { User ,Item} = require('./models'); // Sequelize model
require('dotenv').config();

const app = express();
// To this:
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors()); 
app.use(bodyParser.json());

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      points_balance: 0,
      is_admin: false,
      fullName
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Success! The ReWear backend is alive!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if token is no longer valid
    req.user = user;
    next(); // move on to the next middleware
  });
};
app.post('/api/items/add', authenticateToken, async (req, res) => {
  try {
    const { title, description, category } = req.body; // Add more fields as needed
    const newItem = await Item.create({
      title,
      description,
      category,
      status: 'Available', // Default status
      image: '/placeholder.svg', // Placeholder for now
      userId: req.user.id // This comes from the authenticated token!
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add item' });
  }
});
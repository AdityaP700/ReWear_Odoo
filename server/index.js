// index.js - THE CORRECT AND COMPLETE FILE

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const { User, Item, Swap } = require('./models'); // Sequelize model
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// === MIDDLEWARE ===
app.use(cors()); 
app.use(bodyParser.json());

// === HELPER FUNCTIONS ===
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


// === API ROUTES ===

// --- Test Route ---
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Success! The ReWear backend is alive!' });
});

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username, email, password: hashedPassword, points_balance: 0, is_admin: false, fullName
    });
    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, is_admin: user.is_admin }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});


// --- Item Routes ---
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, { include: { model: User, attributes: ['id', 'username'] } });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    console.error('Fetch item detail error:', error);
    res.status(500).json({ message: 'Failed to fetch item details' });
  }
});

app.post('/api/items/add', authenticateToken, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const newItem = await Item.create({
      title, description, category, status: 'Available', image: '/placeholder.svg', userId: req.user.id
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add item' });
  }
});


// --- Dashboard Route ---
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const listings = await Item.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.status(200).json({ user, listings });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});


// --- Swap Routes ---
app.post('/api/swaps/request/:itemId', authenticateToken, async (req, res) => {
  try {
    const requestedItemId = req.params.itemId;
    const requesterId = req.user.id;
    const item = await Item.findByPk(requestedItemId);
    if (!item || item.status !== 'Available') return res.status(404).json({ message: 'Item is not available for swap.' });
    if (requesterId === item.userId) return res.status(400).json({ message: 'You cannot swap for your own item.' });
    const existingSwap = await Swap.findOne({ where: { requested_item_id: requestedItemId, requester_id: requesterId } });
    if (existingSwap) return res.status(400).json({ message: 'You have already requested to swap this item.' });
    const newSwap = await Swap.create({
      requester_id: requesterId, responder_id: item.userId, requested_item_id: requestedItemId, status: 'pending', type: 'swap'
    });
    res.status(201).json({ message: 'Swap request sent successfully!', swap: newSwap });
  } catch (error) {
    console.error('Swap request error:', error);
    res.status(500).json({ message: 'Failed to send swap request.' });
  }
});

// THIS IS THE ROUTE THAT WAS MISSING
app.get('/api/swaps/received', authenticateToken, async (req, res) => {
  try {
    const receivedSwaps = await Swap.findAll({
      where: { responder_id: req.user.id, status: 'pending' },
      include: [
        { model: Item, as: 'RequestedItem' },
        { model: User, as: 'Requester', attributes: ['username'] }
      ]
    });
    res.status(200).json(receivedSwaps);
  } catch (error) {
    console.error('Error fetching received swaps:', error);
    res.status(500).json({ message: 'Failed to fetch swap requests.' });
  }
});

// THIS IS THE OTHER ROUTE THAT WAS MISSING
app.put('/api/swaps/respond/:swapId', authenticateToken, async (req, res) => {
  try {
    const { swapId } = req.params;
    const { action } = req.body;
    const swap = await Swap.findOne({ where: { id: swapId, responder_id: req.user.id } });
    if (!swap) return res.status(404).json({ message: 'Swap request not found.' });

    if (action === 'accept') {
      swap.status = 'accepted';
      await swap.save();
      await Item.update({ status: 'Swapped' }, { where: { id: swap.requested_item_id }});
      res.status(200).json({ message: 'Swap accepted!', swap });
    } else if (action === 'reject') {
      swap.status = 'rejected';
      await swap.save();
      res.status(200).json({ message: 'Swap rejected.', swap });
    } else {
      res.status(400).json({ message: 'Invalid action.' });
    }
  } catch (error) {
    console.error('Error responding to swap:', error);
    res.status(500).json({ message: 'Failed to respond to swap request.' });
  }
});


// === START SERVER (ONCE, AT THE VERY END) ===
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.get('/api/swaps/made', authenticateToken, async (req, res) => {
  try {
    const madeSwaps = await Swap.findAll({
      where: {
        requester_id: req.user.id // The logged-in user is the requester
      },
      // Include details about the item they requested
      include: [{ model: Item, as: 'RequestedItem', attributes: ['id', 'title', 'image'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(madeSwaps);
  } catch (error) {
    console.error('Error fetching made swaps:', error);
    res.status(500).json({ message: 'Failed to fetch your swap history.' });
  }
});
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { status: 'Available' },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({ message: 'Failed to fetch items.' });
  }
});
// index.js - THE FINAL, PRODUCTION-READY VERSION

// --- Setup and Imports ---
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Item, Swap } = require('./models');
require('dotenv').config();

// --- Initialization ---
const app = express();
const server = http.createServer(app); // Create HTTP server FOR Express
const io = new Server(server, { // Attach Socket.IO to the HTTP server
  cors: {
origin: ["http://localhost:3000", "http://localhost:3002","http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 3001;

// === Global Middleware ===
app.use(cors());
app.use(bodyParser.json());
// Make the `io` instance available to all API routes
app.set('io', io);
// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// === Socket.IO Connection Handler ===
io.on('connection', (socket) => {
  console.log(`✅ User connected with socket id: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });
});

// === Helper Functions (Middlewares) ===
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// === API ROUTES ===

// --- Test & Public Routes ---
app.get('/', (req, res) => res.status(200).json({ message: 'Success! The ReWear backend is alive!' }));

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
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.findAll({ where: { status: 'Available' }, order: [['createdAt', 'DESC']] });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({ message: 'Failed to fetch items.' });
  }
});

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
    const { title, description, category, size, condition, brand, color, material } = req.body;
    const newItem = await Item.create({
      title, description, category, size, condition, brand, color, material,
      status: 'Available', images: [], userId: req.user.id
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add item' });
  }
});

app.post('/api/items/:itemId/images', [authenticateToken, upload.array('images', 5)], async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findOne({ where: { id: itemId, userId: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Item not found or you do not have permission to edit it.' });
    const filepaths = req.files.map(file => `/uploads/${file.filename}`);
    await item.update({ images: filepaths });
    res.status(200).json({ message: 'Images uploaded successfully!', item });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload images.' });
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

    if (!item || item.status !== 'Available') {
      return res.status(404).json({ message: 'Item is not available for swap.' });
    }

    if (requesterId === item.userId) {
      return res.status(400).json({ message: 'You cannot swap for your own item.' });
    }

    const existingSwap = await Swap.findOne({
      where: {
        requested_item_id: requestedItemId,
        requester_id: requesterId,
      }
    });

    if (existingSwap) {
      return res.status(400).json({ message: 'You have already requested to swap this item.' });
    }

    const newSwap = await Swap.create({
      requester_id: requesterId,
      responder_id: item.userId,
      requested_item_id: requestedItemId,
      status: 'pending',
      type: 'swap',
    });

    // ✅ Emit Socket.IO event
    const io = req.app.get('io');
    io.emit('new_swap_request', {
      responderId: item.userId,
      itemId: requestedItemId,
      requesterId: requesterId,
    });

    res.status(201).json({ message: 'Swap request sent successfully!', swap: newSwap });

  } catch (error) {
    console.error('Swap request error:', error);
    res.status(500).json({ message: 'Failed to send swap request.' });
  }
});

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

app.put('/api/swaps/respond/:swapId', authenticateToken, async (req, res) => {
  try {
    const { swapId } = req.params;
    const { action } = req.body;

    const swap = await Swap.findOne({
      where: {
        id: swapId,
        responder_id: req.user.id,
      },
    });

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found.' });
    }

    if (action === 'accept') {
      swap.status = 'accepted';
      await swap.save();

      // Update the item status to 'Swapped'
      await Item.update(
        { status: 'Swapped' },
        { where: { id: swap.requested_item_id } }
      );

    } else if (action === 'reject') {
      swap.status = 'rejected';
      await swap.save();

    } else {
      return res.status(400).json({ message: 'Invalid action.' });
    }

    // ✅ Emit update to requester
    const requesterId = swap.requester_id;
    const io = req.app.get('io');
    io.emit('swap_status_update', { requesterId });

    res.status(200).json({
      message: `Swap ${action === 'accept' ? 'accepted' : 'rejected'}.`,
      swap,
    });

  } catch (error) {
    console.error('Error responding to swap:', error);
    res.status(500).json({ message: 'Failed to respond to swap request.' });
  }
});

app.get('/api/swaps/made', authenticateToken, async (req, res) => {
  try {
    const madeSwaps = await Swap.findAll({
      where: { requester_id: req.user.id },
      include: [{ model: Item, as: 'RequestedItem', attributes: ['id', 'title', 'image'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(madeSwaps);
  } catch (error) {
    console.error('Error fetching made swaps:', error);
    res.status(500).json({ message: 'Failed to fetch your swap history.' });
  }
});

// --- Admin Routes ---
app.get('/api/admin/users', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

app.get('/api/admin/listings', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const listings = await Item.findAll({
      include: { model: User, attributes: ['username'] },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch listings.' });
  }
});

app.get('/api/admin/orders', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const orders = await Swap.findAll({
      include: [
        { model: User, as: 'Requester', attributes: ['username'] },
        { model: User, as: 'Responder', attributes: ['username'] },
        { model: Item, as: 'RequestedItem', attributes: ['title'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});
app.put('/api/admin/items/:itemId', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body; // Expecting { status: 'Available' } or { status: 'Rejected' }

    // Add validation for the status
    const validStatuses = ['Available', 'Rejected', 'Pending']; // Add any other statuses you might use
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'A valid status is required.' });
    }

    const [updateCount] = await Item.update({ status }, {
      where: { id: itemId }
    });

    if (updateCount === 0) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    
    // Log the admin action for your records
    console.log(`[ADMIN ACTION] User ${req.user.username} updated Item ${itemId} to status: ${status}`);

    res.status(200).json({ message: `Item has been successfully ${status}.` });

  } catch (error) {
    console.error('Admin item update error:', error);
    res.status(500).json({ message: 'Failed to update item status.' });
  }
});
// === START THE SERVER ===
// This MUST be server.listen, not app.listen, to handle both HTTP and WebSockets
server.listen(PORT, () => {
  console.log(`✅✅✅ ReWear Server with Real-Time features is running on http://localhost:${PORT}`);
});

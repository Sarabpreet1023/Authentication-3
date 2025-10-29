// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const users = require('./users');
const { authenticateToken, authorizeRoles, SECRET } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || password !== user.password) return res.sendStatus(401);

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protected routes
app.get('/admin', authenticateToken, authorizeRoles('Admin'), (req, res) => {
  res.send('Welcome to Admin Dashboard');
});

app.get('/moderator', authenticateToken, authorizeRoles('Admin', 'Moderator'), (req, res) => {
  res.send('Moderator Tools Access');
});

app.get('/profile', authenticateToken, authorizeRoles('Admin', 'Moderator', 'User'), (req, res) => {
  res.send(`Hello ${req.user.username}, this is your profile`);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));

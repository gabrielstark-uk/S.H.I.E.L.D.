// netlify/functions/api.js
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const router = express.Router();

// Middleware
app.use(bodyParser.json());

// Mock user data for demo purposes
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    passwordHash: '$2a$10$XQCg1z4YSAj.RrXcFGL6QOyO3NvG9yD.Y3RSrgE5MIJzUxmGkRLSm', // password: admin123
    firstName: 'Admin',
    lastName: 'User',
    role: 'sudo',
    subscriptionTier: 'enterprise',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: true
      }
    }
  }
];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Routes
router.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // In a real app, you'd use bcrypt.compare
    // For demo, we'll just check if the user exists
    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        tier: user.subscriptionTier,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Admin routes
router.get('/admin/users', (req, res) => {
  // In a real app, you'd verify the JWT token here
  const usersWithoutPasswords = users.map(user => {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(usersWithoutPasswords);
});

// Add more routes as needed

app.use('/api', router);

// Export the serverless function
exports.handler = serverless(app);
import jwt from 'jsonwebtoken';
import User from '../Model/User.js';

// Generate JWT token
const generateToken = (userId) => {
  const payload = { userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
};

// Login user and generate token
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = await User.create({ username, password });

    // Generate token
    const token = generateToken(newUser._id);

    return res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
};

export { generateToken, login, createUser };

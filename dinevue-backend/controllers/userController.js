const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../model/userModel'); // Ensure this is the correct path
require('dotenv').config();
const crypto = require('crypto');
const Restaurant = require('../model/restaurantModel');
const commonPasswords = require('./common-passwords'); // Adjust the path to your common passwords list
const { Op } = require('sequelize')

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if the account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        success: false,
        message: `Account is locked. Please try again after ${new Date(user.lockUntil).toLocaleTimeString()}`
      });
    }

    // Check if the password is expired
    if (user.passwordExpiresAt && user.passwordExpiresAt < Date.now()) {
      return res.status(403).json({
        success: false,
        message: 'Your password has expired. Please update your password to continue.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await handleFailedLoginAttempt(user);
      return res.status(401).json({
        success: false,
        message: 'Incorrect Password'
      });
    }

    // Reset failed login attempts after a successful login
    await user.update({
      loginAttempts: 0,
      lockUntil: null
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, phone: user.phone },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: '15d' } // Token expires in 15 days
    );

    const userDetails = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isAdmin: user.isAdmin,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      userData: userDetails
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};



const handleFailedLoginAttempt = async (user) => {
  let updates = { loginAttempts: (user.loginAttempts || 0) + 1 };

  if (updates.loginAttempts >= MAX_ATTEMPTS) {
    updates.lockUntil = Date.now() + LOCK_TIME;
    updates.loginAttempts = 0; // Reset the login attempts counter after locking the account
  }

  await user.update(updates);
};


const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Password criteria
    const passwordLength = password.length;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (passwordLength < 8 || passwordLength > 20) {
      return res.status(400).json({ message: 'Password must be between 8 and 20 characters.' });
    }

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({ message: 'Password must include uppercase, lowercase, number, and special character.' });
    }

    // Prevent common passwords
    if (commonPasswords.includes(password)) {
      return res.status(400).json({ message: 'This password is too common. Please choose a different one.' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set password expiration (e.g., 90 days from now)
    const now = new Date();
    const passwordExpiresAt = new Date(now.setDate(now.getDate() + 90)); // 90 days expiration

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      passwordLastUpdated: new Date(),
      passwordExpiresAt
    });

    // Respond with success
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email, phone } = req.body;

  try {
    let user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Send code to user's email
const sendCodeToEmail = async (email, code) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Password Reset Code",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

const requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const code = generateRandomCode();
    user.resetCode = code;
    await user.save();

    await sendCodeToEmail(email, code);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (code !== user.resetCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification code is correct.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const verifyCodeAndChangePassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (code !== user.resetCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    const randomSalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(newPassword, randomSalt);

    user.password = encryptedPassword;
    user.resetCode = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: error.message,
    });
  }
};

const addRestaurantToSaved = async (req, res) => {
  const userId = req.params.userId;
  const restaurantId = req.params.restaurantId;

  try {
    // Find user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Find restaurant by ID
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found.',
      });
    }

    // Check if the restaurant is already saved
    const isRestaurantSaved = user.savedRestaurants.includes(restaurantId);
    if (isRestaurantSaved) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant already saved.',
      });
    }

    // Add restaurant ID to savedRestaurants array
    user.savedRestaurants.push(restaurantId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Restaurant added to saved restaurants.',
      savedRestaurants: user.savedRestaurants,
    });
  } catch (error) {
    console.error('Add restaurant to saved error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: error.message,
    });
  }
};
//

//
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  generateRandomCode,
  sendCodeToEmail,
  requestCode,
  verifyCodeAndChangePassword,
  verifyCode,
  changePassword,
  addRestaurantToSaved
};

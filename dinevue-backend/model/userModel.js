// models/userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const { Restaurant } = require('./restaurantModel'); // Import the Restaurant model

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_admin'
  },
  resetCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetCodeExpiration: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  savedRestaurants: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of integers (restaurant IDs)
    defaultValue: [],
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  passwordLastUpdated: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  passwordExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
});

// Define association to Restaurant model
User.belongsToMany(Restaurant, { through: 'UserSavedRestaurants' });

module.exports = User;

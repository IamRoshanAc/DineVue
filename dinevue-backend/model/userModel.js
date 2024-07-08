// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name' // specify the database column name
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name' // specify the database column name
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
    field: 'is_admin' // specify the database column name
  },
}, {
  tableName: 'users', // specify the table name
});

module.exports = User;

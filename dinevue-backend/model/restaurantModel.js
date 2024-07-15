const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Restaurant = sequelize.define('Restaurant', {
  restaurantName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  restaurantEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  foods: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  location: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  popularDishes: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: false
  },
  seatingDetails: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: false
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  coverphoto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  menuPhotos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  dishesphotos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.INTEGER, // Use DataTypes.INTEGER instead of INTEGER
    defaultValue: 0
  },
  openingtime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  closingtime: {
    type: DataTypes.TIME,
    allowNull: true
  },
}, {
  tableName: 'restaurants',
});

module.exports = {
  Restaurant
};

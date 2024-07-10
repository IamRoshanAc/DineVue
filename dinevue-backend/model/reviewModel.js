const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const Restaurant = require('./restaurantModel');
const User = require('./userModel');

const Review = sequelize.define('Review', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Review;

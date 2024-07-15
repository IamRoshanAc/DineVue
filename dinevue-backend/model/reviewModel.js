// reviewModel.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/db'); // Adjust path as per your folder structure

class Review extends Model {}

Review.init({
    FoodRating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ServiceRating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    AmbienceRating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    OverallRating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ReviewText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RestaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UserName: {
        type: DataTypes.STRING, // Ensure data type matches the one you've added in the database
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Review'
});

module.exports = Review;

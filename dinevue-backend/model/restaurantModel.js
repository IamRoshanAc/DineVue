const { DataTypes } = require('sequelize');
const sequelize = require('../database/db'); // Adjust this import according to your project structure

const Restaurant = sequelize.define('Restaurant', {
    restaurantName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'restaurant_name'
    },
    restaurantEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        field: 'restaurant_email'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true
        }
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
        type: DataTypes.ARRAY(DataTypes.STRING), // Changed to ARRAY to match data input
        allowNull: false
    },
    location: {
        type: DataTypes.JSON,
        allowNull: false
    },
    popularDishes: {
        type: DataTypes.ARRAY(DataTypes.JSON), // Changed to JSON to include both name and photo
        allowNull: false,
        field: 'popular_dishes'
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
        allowNull: false,
        field: 'menu_photos'
    },
    seatingDetails: {
        type: DataTypes.ARRAY(DataTypes.JSON), // Changed to JSON to store multiple seating types and options
        allowNull: false,
        field: 'seating_details'
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'restaurants',
    timestamps: true,
    underscored: true // This ensures that the timestamps are in snake_case
});

module.exports = Restaurant;

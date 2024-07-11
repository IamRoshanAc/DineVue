const { DataTypes, INTEGER } = require('sequelize');
const sequelize = require('../database/db');

const Restaurant = sequelize.define('Restaurant', {
    // Define your model attributes here
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
    approved:{
        type: Boolean,
        defaultValue: false
    },
    rating:{
        type:INTEGER,
        defaultValue: 0
    },
    openingtime: {
        type: DataTypes.TIME,
        defaultValue:10,
        allowNull: true
    },
    closingtime: {
        type: DataTypes.TIME,
        defaultValue:24,
        allowNull: true
    },
});

module.exports = {
    Restaurant
};

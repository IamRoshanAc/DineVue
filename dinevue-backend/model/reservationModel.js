const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const Restaurant = require('./restaurantModel');

const Reservation = sequelize.define('Reservation', {
    reservationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numberOfPeople: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    seatingType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    occasion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    specialRequests: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Reservation;

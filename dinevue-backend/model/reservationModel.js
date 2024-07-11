// models/reservation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const Restaurant = require('./restaurantModel').Restaurant;

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
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'restaurants',
            key: 'id'
        }
    }
}, {
    tableName: 'reservations',
});

// Establish association
Restaurant.hasMany(Reservation, { foreignKey: 'restaurantId', sourceKey: 'id' });
Reservation.belongsTo(Restaurant, { foreignKey: 'restaurantId', targetKey: 'id' });

module.exports = Reservation;

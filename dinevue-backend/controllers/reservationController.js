// controllers/reservationController.js
const Reservation = require('../model/reservationModel');
const Restaurant = require('../model/restaurantModel').Restaurant;

// Create a new reservation
const createReservation = async (req, res) => {
    const { restaurantId, numberOfPeople, date, time, seatingType, customerPhone, customerEmail, occasion, specialRequests } = req.body;

    try {
        // Check if the restaurant exists
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Create the reservation
        const reservation = await Reservation.create({
            restaurantId,
            numberOfPeople,
            date,
            time,
            seatingType,
            customerPhone,
            customerEmail,
            occasion,
            specialRequests,
            status: 'pending'
        });

        res.status(201).json({
            message: 'Reservation created successfully',
            reservation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the reservation' });
    }
};

module.exports = {
    createReservation
};

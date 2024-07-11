// In your backend route file (e.g., reservations.js)
const express = require('express');
const router = express.Router();
const { createReservation } = require('../controllers/reservationController');

// Route to create a reservation
router.post('/create_reservations', createReservation);

module.exports = router;
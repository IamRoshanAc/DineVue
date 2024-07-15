const express = require('express');
const router = express.Router();
const {
    createReservation,
    getReservationsByUserId,
    getReservationsByRestaurantId,
    updateReservationStatus,
    cancelReservation
} = require('../controllers/reservationController');

// Route to create a reservation
router.post('/create_reservation', createReservation);

// Route to get reservations by user ID
router.get('/user/:userId', getReservationsByUserId);

// Route to get reservations by restaurant ID
router.get('/restaurant/:restaurantId', getReservationsByRestaurantId);

// Route to update reservation status by reservation ID
router.put('/:reservationId/update_status', updateReservationStatus);

router.delete('/:reservationId', cancelReservation);

module.exports = router;

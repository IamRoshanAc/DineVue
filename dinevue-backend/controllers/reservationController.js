const Reservation = require('../model/reservationModel');
const User = require('../model/userModel'); // Ensure this is the correct path
const Restaurant = require('../model/restaurantModel').Restaurant;

// Function to create a new reservation
const createReservation = async (req, res) => {
  const { restaurantId, numberOfPeople, date, time, seatingType, customerPhone, customerEmail, occasion, specialRequests, userId } = req.body;

  try {
    // Check if the restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const seatingDetails = restaurant.seatingDetails;
    const seatingDetail = seatingDetails.find(detail => detail.type === seatingType);
    if (!seatingDetail) {
      return res.status(400).json({ error: 'Invalid seating type' });
    }

    const options = seatingDetail.options;
    const numberOfPeopleKey = `${numberOfPeople}people`;
    if (!options[numberOfPeopleKey]) {
      return res.status(400).json({ error: 'Invalid number of people for the seating type' });
    }

    // Check existing reservations for the same date, time, seatingType, and numberOfPeople
    const existingReservations = await Reservation.findAll({
      where: {
        restaurantId,
        date,
        time,
        seatingType,
        numberOfPeople,
      }
    });

    if (existingReservations.length >= options[numberOfPeopleKey]) {
      return res.status(400).json({ error: 'Reservation limit reached for the selected seat' });
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
      userId, // Include userId in reservation
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

// Function to get reservations by user ID
const getReservationsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const reservations = await Reservation.findAll({ where: { userId } });
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found for this user' });
    }
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching reservations' });
  }
};

// Function to get reservations by restaurant ID
const getReservationsByRestaurantId = async (req, res) => {
  let { restaurantId } = req.params;

  // Convert restaurantId to integer if it's a valid number
  restaurantId = parseInt(restaurantId, 10);

  // Check if restaurantId is a valid integer
  if (isNaN(restaurantId)) {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }

  try {
    const reservations = await Reservation.findAll({ where: { restaurantId } });
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found for this restaurant' });
    }
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching reservations' });
  }
};

// Function to update reservation status
const updateReservationStatus = async (req, res) => {
  const { reservationId } = req.params;
  const { status } = req.body;

  try {
    // Find the reservation by reservationId
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Update the status
    reservation.status = status;
    await reservation.save();

    res.status(200).json({ message: 'Reservation status updated successfully', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating reservation status' });
  }
};

// Function to cancel a reservation
const cancelReservation = async (req, res) => {
  const { reservationId } = req.params;

  try {
    // Find the reservation by reservationId
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if the reservation is already cancelled
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation is already cancelled' });
    }

    // Update the status to 'cancelled'
    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({ message: 'Reservation cancelled successfully', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while cancelling the reservation' });
  }
};

module.exports = {
  createReservation,
  getReservationsByUserId,
  getReservationsByRestaurantId,
  updateReservationStatus,
  cancelReservation // Export the new function
};

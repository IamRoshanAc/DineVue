const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// POST route to create a new restaurant
router.post('/createRestaurant', restaurantController.createRestaurant);

// GET route to fetch all restaurants
router.get('/getAllRestaurants', restaurantController.getAllRestaurants);

// GET route to fetch a single restaurant by ID
router.get('/restaurant/:id', restaurantController.getSingleRestaurant);


router.post('/loginRestaurant', restaurantController.loginRestaurant);

module.exports = router;

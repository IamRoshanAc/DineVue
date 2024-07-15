const express = require('express');
const router = express.Router();
const { createReview, getAllReviews } = require('../controllers/reviewController');

// Route to create a review
router.post('/create_review', createReview);

// Route to get all reviews

router.get('/getAllReviews', getAllReviews)
module.exports = router;

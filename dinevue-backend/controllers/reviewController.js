const Review = require('../model/reviewModel');
const User = require('../model/userModel');
const Restaurant = require('../model/restaurantModel');

// Create a new review
const createReview = async (req, res) => {
    const { FoodRating, ServiceRating, AmbienceRating, OverallRating, ReviewText, UserId, RestaurantId, UserName } = req.body;

    try {
        // Check if a review with the same UserId and RestaurantId already exists
        const existingReview = await Review.findOne({
            where: { UserId, RestaurantId }
        });

        if (existingReview) {
            return res.status(400).json({ message: 'Your review is already submitted' });
        }

        // Create the review
        const newReview = await Review.create({
            FoodRating,
            ServiceRating,
            AmbienceRating,
            OverallRating,
            ReviewText,
            UserId,
            RestaurantId,
            UserName // Include UserName here
        });

        res.status(201).json({ message: 'Review created successfully', data: newReview });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Error creating review' });
    }
};

// Function to fetch all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json({ data: reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

module.exports = {
    createReview,
    getAllReviews,
};

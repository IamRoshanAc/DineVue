const { Restaurant } = require('../model/restaurantModel'); // Ensure the correct path to the model
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to upload images to Cloudinary
const uploadImages = async (files) => {
    return await Promise.all(files.map(async (file) => {
        const uploadedImage = await cloudinary.uploader.upload(
            file.path,
            {
                folder: "restaurants",
                crop: "scale"
            }
        );
        return uploadedImage.secure_url;
    }));
};

// Create a new restaurant
const createRestaurant = async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    const {
        restaurantName,
        restaurantEmail,
        phone,
        address,
        password,
        description,
        tags,
        foods,
        location,
        popularDishes,
        seatingDetails
    } = req.body;

    const photos = req.files.photos || [];
    const coverphoto = req.files.coverphoto || [];
    const menuPhotos = req.files.menuPhotos || [];

    if (!restaurantName || !restaurantEmail || !phone || !address || !password || !description || !tags || !foods || !location || !popularDishes || !seatingDetails || photos.length === 0 || coverphoto.length === 0 || menuPhotos.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields."
        });
    }

    try {
        const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
        const parsedLocation = Array.isArray(location) ? location : JSON.parse(location);
        const parsedPopularDishes = Array.isArray(popularDishes) ? popularDishes : JSON.parse(popularDishes);
        const parsedSeatingDetails = Array.isArray(seatingDetails) ? seatingDetails : JSON.parse(seatingDetails);
        const parsedFoods = Array.isArray(foods) ? foods : JSON.parse(foods);

        // Upload images to Cloudinary
        const uploadedPhotos = await uploadImages(photos);
        const uploadedCoverPhoto = await uploadImages(coverphoto);
        const uploadedMenuPhotos = await uploadImages(menuPhotos);

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new restaurant instance
        const newRestaurant = await Restaurant.create({
            restaurantName,
            restaurantEmail,
            phone,
            address,
            password: hashedPassword,
            description,
            tags: parsedTags,
            foods: parsedFoods,
            location: parsedLocation,
            popularDishes: parsedPopularDishes,
            seatingDetails: parsedSeatingDetails,
            photos: uploadedPhotos,
            coverphoto: uploadedCoverPhoto[0], // Assuming only one cover photo
            menuPhotos: uploadedMenuPhotos,
            approved: false, // Default value
            rating: 0 // Default value
        });

        res.status(200).json({
            success: true,
            message: "Restaurant created successfully",
            data: newRestaurant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Define a basic getAllRestaurants function
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll();
        res.status(200).json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Define the revised getSingleRestaurant function
const getSingleRestaurant = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Restaurant ID is required!"
        });
    }

    try {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Restaurant fetched successfully",
            data: restaurant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const loginRestaurant = async (req, res) => {
    try {
        const { restaurantEmail, password } = req.body;

        // Validate request data
        if (!restaurantEmail || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the restaurant by email
        const restaurant = await Restaurant.findOne({ where: { restaurantEmail } });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if the restaurant is approved
        if (!restaurant.approved) {
            return res.status(403).json({ message: 'Restaurant is not approved yet' });
        }

        // Compare the provided password with the stored password
        let isMatch = false;
        if (restaurant.password.startsWith('$2b$')) {
            // If the stored password is hashed
            isMatch = await bcrypt.compare(password, restaurant.password);
        } else {
            // If the stored password is plaintext (for backward compatibility)
            isMatch = password === restaurant.password;
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: restaurant.id, email: restaurant.restaurantEmail },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Include restaurant details in the response
        const restaurantDetails = {
            id: restaurant.id,
            restaurantEmail: restaurant.restaurantEmail,
            restaurantName: restaurant.restaurantName,
            phone: restaurant.phone,
            address: restaurant.address,
            description: restaurant.description,
            tags: restaurant.tags,
            foods: restaurant.foods,
            location: restaurant.location,
            popularDishes: restaurant.popularDishes,
            seatingDetails: restaurant.seatingDetails,
            photos: restaurant.photos,
            coverphoto: restaurant.coverphoto,
            menuPhotos: restaurant.menuPhotos,
            dishesphotos: restaurant.dishesphotos,
            approved: restaurant.approved,
            rating: restaurant.rating,
            openingtime: restaurant.openingtime,
            closingtime: restaurant.closingtime,
        };

        res.status(200).json({
            message: 'Login successful',
            token,
            restaurant: restaurantDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update the approved status of a restaurant
const updateRestaurantApproval = async (req, res) => {
    const id = req.params.id;
    const { approved } = req.body;

    if (typeof approved !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: "Approved status must be a boolean value."
        });
    }

    try {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        restaurant.approved = approved;
        await restaurant.save();

        res.status(200).json({
            success: true,
            message: "Restaurant approval status updated successfully",
            data: restaurant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getSingleRestaurant,
    loginRestaurant,
    updateRestaurantApproval
};

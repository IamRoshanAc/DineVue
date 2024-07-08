const Restaurant = require('../model/restaurantModel');
const cloudinary = require('cloudinary').v2;

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

    console.log('restaurantName:', restaurantName);
    console.log('restaurantEmail:', restaurantEmail);
    console.log('phone:', phone);
    console.log('address:', address);
    console.log('password:', password);
    console.log('description:', description);
    console.log('tags:', tags);
    console.log('foods:', foods);
    console.log('location:', location);
    console.log('popularDishes:', popularDishes);
    console.log('seatingDetails:', seatingDetails);
    console.log('photos:', photos);
    console.log('coverphoto:', coverphoto);
    console.log('menuPhotos:', menuPhotos);

    if (!restaurantName || !restaurantEmail || !phone || !address || !password || !description || !tags || !foods || !location || !popularDishes || !seatingDetails || photos.length === 0 || coverphoto.length === 0 || menuPhotos.length === 0) {
        return res.json({
            success: false,
            message: "Please fill all the fields."
        });
    }

    try {
        const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
        const parsedLocation = Array.isArray(location) ? location : JSON.parse(location);
        const parsedPopularDishes = Array.isArray(popularDishes) ? popularDishes : JSON.parse(popularDishes);
        const parsedSeatingDetails = Array.isArray(seatingDetails) ? seatingDetails : JSON.parse(seatingDetails);

        const uploadedPhotos = await uploadImages(photos);
        const uploadedCoverPhoto = await uploadImages(coverphoto);
        const uploadedMenuPhotos = await uploadImages(menuPhotos);

        const newRestaurant = new Restaurant({
            restaurantName,
            restaurantEmail,
            phone,
            address,
            password,
            description,
            tags: parsedTags,
            foods,
            location: parsedLocation,
            popularDishes: parsedPopularDishes,
            seatingDetails: parsedSeatingDetails,
            photos: uploadedPhotos,
            coverphoto: uploadedCoverPhoto[0],
            menuPhotos: uploadedMenuPhotos
        });

        await newRestaurant.save();

        res.status(200).json({
            success: true,
            message: "Restaurant created successfully",
            data: newRestaurant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const listOfRestaurants = await Restaurant.findAll();
        res.json({
            success: true,
            message: "Restaurants fetched successfully",
            restaurants: listOfRestaurants
        });
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
};

// Get a single restaurant by ID
const getSingleRestaurant = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.json({
            success: false,
            message: "Restaurant ID is required!"
        });
    }
    try {
        const singleRestaurant = await Restaurant.findByPk(id);
        if (singleRestaurant) {
            res.json({
                success: true,
                message: "Restaurant fetched successfully",
                restaurant: singleRestaurant
            });
        } else {
            res.json({
                success: false,
                message: "Restaurant not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getSingleRestaurant
};

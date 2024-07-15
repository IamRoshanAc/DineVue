// utils.js
import { getSingleRestaurantApi } from '../apis/Api';

// Fetch details for a single restaurant
const fetchRestaurantDetails = async (restaurantId) => {
    try {
        const response = await getSingleRestaurantApi(restaurantId);
        return {
            id: response.data.id,
            name: response.data.restaurantName,
            coverPhoto: response.data.coverphoto
        };
    } catch (error) {
        console.error(`Error fetching details for restaurantId ${restaurantId}:`, error);
        return null;
    }
};

// Fetch all unique restaurant details
export const fetchAllUniqueRestaurantDetails = async (reservations) => {
    const uniqueRestaurantIds = [...new Set(reservations.map(reservation => reservation.restaurantId))];

    const fetchDetailsPromises = uniqueRestaurantIds.map(fetchRestaurantDetails);
    const restaurantDetailsArray = await Promise.all(fetchDetailsPromises);

    return restaurantDetailsArray.reduce((acc, restaurantDetails) => {
        if (restaurantDetails) {
            acc[restaurantDetails.id] = restaurantDetails;
        }
        return acc;
    }, {});
};

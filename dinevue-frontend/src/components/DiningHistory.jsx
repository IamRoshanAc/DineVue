import React, { useEffect, useState } from 'react';
import '../style/DiningHistory.css';
import { MdRateReview } from "react-icons/md";
import { getReservationByUserId, getAllRestaurantApi } from '../apis/Api'; // Adjust the import path as needed
import { Link } from 'react-router-dom';

const DiningHistory = () => {
    const [diningData, setDiningData] = useState([]);
    const [restaurantDetails, setRestaurantDetails] = useState({});

    useEffect(() => {
        const fetchReservationsAndRestaurantDetails = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    const userId = userData.id;

                    // Fetch reservations
                    const reservationResponse = await getReservationByUserId(userId);
                    const reservations = reservationResponse.data;
                    console.log('Reservations:', reservations);

                    // Filter reservations to only include completed ones
                    const completedReservations = reservations.filter(reservation => reservation.status === "completed");
                    console.log('Completed Reservations:', completedReservations);
                    setDiningData(completedReservations);

                    // Fetch all restaurants
                    const allRestaurantsResponse = await getAllRestaurantApi();
                    const allRestaurants = allRestaurantsResponse.data.data;
                    console.log('All Restaurants:', allRestaurants);

                    // Check if allRestaurants is an array
                    if (!Array.isArray(allRestaurants)) {
                        throw new Error('Expected allRestaurants to be an array');
                    }

                    // Create a map of restaurant details by ID
                    const restaurantDetailsMap = allRestaurants.reduce((acc, restaurant) => {
                        acc[restaurant.id] = {
                            name: restaurant.restaurantName,
                            image: restaurant.coverphoto
                        };
                        return acc;
                    }, {});

                    console.log('Restaurant Details Map:', restaurantDetailsMap);
                    setRestaurantDetails(restaurantDetailsMap);
                } else {
                    console.error('User not found in local storage');
                }
            } catch (error) {
                console.error('Error fetching dining history:', error);
            }
        };

        fetchReservationsAndRestaurantDetails();
    }, []);

    return (
        <div className="dining-history-container">
            {diningData.length > 0 ? (
                diningData.map((dining) => {
                    const restaurant = restaurantDetails[dining.restaurantId] || {};
                    console.log('Rendering Dining:', { dining, restaurant }); // Debugging
                    return (
                        <div key={dining.reservationId} className="dining-card">
                            <Link to={`/restaurant_view/${dining.restaurantId}`} className="dining-image-link">
                                {restaurant.image ? (
                                    <img src={restaurant.image} alt={restaurant.name} className="dining-image" />
                                ) : (
                                    <div className="dining-image-placeholder">No Image</div>
                                )}
                            </Link>
                            <div className="dining-details">
                                <h3>{restaurant.name || 'Unknown Restaurant'}</h3>
                                <p><span role="img" aria-label="persons">👥</span> {dining.numberOfPeople} ({dining.seatingType})</p>
                                <p><span role="img" aria-label="calendar">📅</span> {new Date(dining.date).toDateString()}</p>
                                <p><span role="img" aria-label="clock">🕒</span> {dining.time}</p>
                            </div>
                            <div className="dining-actions">
                                <Link to={`/review/${dining.restaurantId}`} className="message-icon"><MdRateReview /></Link>
                                <br/>
                                <Link to={`/restaurant_view/${dining.restaurantId}`} className="reserve-button">Reserve Again</Link>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No completed reservations found.</p>
            )}
        </div>
    );
};

export default DiningHistory;

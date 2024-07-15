import React, { useEffect, useState } from 'react';
import '../style/Tooltip.css';
import { getReservationByUserId, getAllRestaurantApi } from '../apis/Api'; // Adjust the import path as needed

const Tooltip = ({ show }) => {
  const [reservation, setReservation] = useState(null);
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
          const pendingReservations = reservationResponse.data.filter(reservation => reservation.status === "pending");

          if (pendingReservations.length > 0) {
            setReservation(pendingReservations[0]);
          }

          // Fetch all restaurants
          const allRestaurantsResponse = await getAllRestaurantApi();
          const allRestaurants = allRestaurantsResponse.data.data;

          // Create a map of restaurant details by ID
          const restaurantDetailsMap = allRestaurants.reduce((acc, restaurant) => {
            acc[restaurant.id] = {
              name: restaurant.restaurantName,
            };
            return acc;
          }, {});

          setRestaurantDetails(restaurantDetailsMap);
        } else {
          console.error('User not found in local storage');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchReservationsAndRestaurantDetails();
  }, []);

  if (!show || !reservation) {
    return null;
  }

  const restaurant = restaurantDetails[reservation.restaurantId] || {};

  return (
    <div className="nav-tooltip">
      <h2 className="nav-modal-title">Upcoming Reservations</h2>
      <div className="nav-reservation-card">
        <h3 className="nav-restaurant-name">{restaurant.name || 'Unknown Restaurant'}</h3>
        <div className="nav-reservation-details">
          <div className="nav-detail-item">
            <span className="nav-icon">👥</span> {reservation.numberOfPeople} ({reservation.seatingType})
          </div>
          <div className="nav-detail-item">
            <span className="nav-icon">📅</span> {new Date(reservation.date).toDateString()}
          </div>
          <div className="nav-detail-item">
            <span className="nav-icon">🕒</span> {reservation.time}
          </div>
        </div>
      </div>
      <a href="/profile" className="nav-view-all">View All Reservations</a>
    </div>
  );
};

export default Tooltip;

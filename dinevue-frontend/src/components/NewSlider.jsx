import React, { useState, useEffect } from 'react';
import '../style/Slider.css';
import { Link } from 'react-router-dom';
import { getAllRestaurantApi } from '../apis/Api';
import { ToastContainer, toast } from 'react-toastify';

const NewSlider = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getAllRestaurantApi(token);
        if (response.data.success) {
          const approvedRestaurants = response.data.data.filter(restaurant => restaurant.approved);
          setRestaurants(approvedRestaurants);
        } else {
          toast.error("Failed to fetch restaurants");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast.error("Failed to fetch restaurants. Please check your network and try again.");
      }
    };

    fetchRestaurants();
  }, []);

  // Function to render star ratings
  const renderRatingStars = (rating) => {
    const filledStars = Math.round(rating); // Round to nearest whole star
    const totalStars = 5;
    const stars = [];

    // Render filled stars
    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={`filled-${i}`}>&#9733;</span>);
    }

    // Render empty stars
    for (let i = filledStars; i < totalStars; i++) {
      stars.push(<span key={`empty-${i}`}>&#9734;</span>);
    }

    return stars;
  };

  return (
    <div className="slider-wrapper">
      <p className="fs-1">New</p>
      <div className="card-slider-container">
        <div className="card-slider">
          {restaurants.map((restaurant) => (
            <Link to={`/restaurant_view/${restaurant.id}`} className="card" key={restaurant.id}>
              <img
                src={restaurant.coverphoto}
                className="card-img-top"
                alt={restaurant.restaurantName}
              />
              <div className="card-body">
                <h5 className="card-title">{restaurant.restaurantName}</h5>
                <div className="rating-slider">
                  {renderRatingStars(restaurant.rating)}
                </div>
                <p className="card-text">{restaurant.address}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NewSlider;

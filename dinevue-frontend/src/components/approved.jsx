import React, { useState, useEffect } from 'react';
import '../style/Slider.css';
import { getAllRestaurantApi, updateRestaurantApprovalApi } from '../apis/Api';
import { ToastContainer, toast } from 'react-toastify';

const ApprovedSlider = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getAllRestaurantApi();
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

  // Function to handle approval status change
  const handleApprovalChange = async (restaurantId) => {
    try {
      const response = await updateRestaurantApprovalApi(restaurantId, false);
      if (response.data.success) {
        setRestaurants((prevRestaurants) => 
          prevRestaurants.filter((restaurant) => restaurant.id !== restaurantId)
        );
        toast.success("Restaurant approval status updated successfully");
      } else {
        toast.error("Failed to update approval status");
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error("Failed to update approval status. Please check your network and try again.");
    }
  };

  return (
    <div className="slider-wrapper">
      <p className="fs-1">Approved Restaurants</p>
      <div className="card-slider-container">
        <div className="card-slider">
          {restaurants.length === 0 ? (
            <p>All restaurants are approved</p>
          ) : (
            restaurants.map((restaurant) => (
              <div className="card" key={restaurant.id}>
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
                  {restaurant.approved && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleApprovalChange(restaurant.id)}
                    >
                      Approved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ApprovedSlider;

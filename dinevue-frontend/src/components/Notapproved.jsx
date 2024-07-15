import React, { useState, useEffect } from 'react';
import '../style/Slider.css';
import { getAllRestaurantApi, updateRestaurantApprovalApi } from '../apis/Api';
import { ToastContainer, toast } from 'react-toastify';

const NotApprovedSlider = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [noUnapprovedRestaurants, setNoUnapprovedRestaurants] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getAllRestaurantApi(token);
        if (response.data.success) {
          const notApprovedRestaurants = response.data.data.filter(restaurant => !restaurant.approved);
          setRestaurants(notApprovedRestaurants);
          if (notApprovedRestaurants.length === 0) {
            setNoUnapprovedRestaurants(true);
          } else {
            setNoUnapprovedRestaurants(false);
          }
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
      const response = await updateRestaurantApprovalApi(restaurantId, true); // Change to approved
      if (response.data.success) {
        // Remove the approved restaurant from the list
        setRestaurants((prevRestaurants) => 
          prevRestaurants.filter(restaurant => restaurant.id !== restaurantId)
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
      <p className="fs-1">Not Approved Restaurants</p>
      {noUnapprovedRestaurants ? (
        <p className="fs-3">All restaurants are approved</p>
      ) : (
        <div className="card-slider-container">
          <div className="card-slider">
            {restaurants.map((restaurant) => (
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
                  {!restaurant.approved && (
                    <button
                      className="btn btn-warning"
                      onClick={() => handleApprovalChange(restaurant.id)}
                    >
                      Not Approved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default NotApprovedSlider;

import React, { useState, useEffect } from "react";
import '../../style/Restaurant_View.css';
import { FaBookmark } from "react-icons/fa";
import RestaurantInfo from "../RestaurantInfo";
import Reservation from "../Reservation";
import Location from "../Location";
import { getSingleRestaurantApi } from '../../apis/Api'; // Adjust the import according to your project structure

const DetailsUpdate = () => {
  const [saved, setSaved] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  // Retrieve the restaurant ID from local storage
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) {
        console.error("No restaurant ID found in local storage");
        return;
      }

      try {
        const response = await getSingleRestaurantApi(id);
        setRestaurant(response.data.data); // Adjusting to access the nested 'data' property
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleSaveClick = () => {
    setSaved(!saved);
  };

  return (
    <div className="restaurant-page">
      {restaurant ? (
        <>
          <header className="header">
            <img src={restaurant.coverphoto} alt="Restaurant" className="header-image" />
            <button className="save-button" onClick={handleSaveClick}>
              <FaBookmark className={`save-icon ${saved ? 'saved' : ''}`} />
              {saved ? 'Restaurant Saved' : 'Save this restaurant'}
            </button>
          </header>
          <div className="main-content">
            <RestaurantInfo restaurant={restaurant} />
            <div className="right-div">
              <Reservation restaurant={restaurant} />
              <Location restaurant={restaurant} />
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DetailsUpdate;

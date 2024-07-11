import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../style/Restaurant_View.css';
import NavbarIndex from '../components/navbar_index'
import Footer from "../components/footer";
import Reservation from "../components/Reservation";
import Location from "../components/Location";
import { FaBookmark } from "react-icons/fa";
import RestaurantInfo from "../components/ResrtaurantInfo";
import { getSingleRestaurantApi } from '../apis/Api'; // Adjust the import according to your project structure

const Index_Restaurant_View = () => {
  const [saved, setSaved] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRestaurant = async () => {
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
      <NavbarIndex/>
      {restaurant ? (
        <>
          <header className="header">
            <img src={restaurant.coverphoto} alt="Restaurant" className="header-image" />
            
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
      <Footer />
    </div>
  );
};

export default Index_Restaurant_View;

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../style/Location.css';
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Location = ({ restaurant }) => {
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    if (restaurant.location && restaurant.location.length === 2) {
      const [latitude, longitude] = restaurant.location;
      setLocationData({ latitude, longitude });
    }
  }, [restaurant]);

  return (
    <div className="location">
      <h2>Location</h2>
      <div className="map-container" style={{ zIndex: 0 }}>
        {locationData ? (
          <MapContainer center={[locationData.latitude, locationData.longitude]} zoom={15} scrollWheelZoom={false} style={{ height: "300px" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[locationData.latitude, locationData.longitude]}>
              <Popup>{restaurant.restaurantName}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
      <div className="location-details">
        <address>
          <FaMapMarkerAlt /> {restaurant.address}
        </address>
        <phone>
          <FaPhoneAlt /> {restaurant.phone}
        </phone>
      </div>
    </div>
  );
};

export default Location;

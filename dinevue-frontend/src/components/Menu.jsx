import React from 'react';
import '../style/Restaurant_View.css';

const Menu = ({ menuPhotos }) => {
  return (
    <div>
      <h2>Menu</h2>
      <div className="menu">
        {menuPhotos.map((photo, index) => (
          <img key={index} src={photo} alt={`Menu ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default Menu;

import React from 'react';
import '../style/Restaurant_View.css';

const Photos = ({ photos }) => {
  return (
    <div>
      <h2>Photos</h2>
      <div className="photos">
        {photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Photo ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default Photos;

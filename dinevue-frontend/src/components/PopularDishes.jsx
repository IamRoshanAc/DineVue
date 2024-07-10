import React from 'react';

const PopularDishes = ({ popularDishes, dishesphotos }) => {
  return (
    <div>
      <h2>Popular Dishes</h2>
      <div className="dishes">
        {popularDishes.map((dish, index) => (
          <div className="dish" key={index}>
            <img src={dishesphotos[index]} alt={dish.name} />
            <span>{dish.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularDishes;

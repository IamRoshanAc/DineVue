import React, { useState } from 'react';
import '../style/Ratings.css';

const Review = ({ rating, name, reviewText, foodRating, serviceRating, ambienceRating }) => (
  <div className="review">
    <div className="review-header">
      <span className="stars">{rating} ★</span>
      <span className="name">{name}</span>
    </div>
    <div className="review-ratings">
      <span className="overall">Overall: {rating}</span>
      <span className="food">Food: {foodRating}</span>
      <span className="service">Service: {serviceRating}</span>
      <span className="ambience">Ambience: {ambienceRating}</span>
    </div>
    <p>{reviewText}</p>
  </div>
);

const Ratings = () => {
  const [showAll, setShowAll] = useState(false);

  const reviews = [
    {
      rating: 4,
      name: 'Roshan Acharya',
      reviewText: 'We all had different main courses. I had the ragu, my wife had the prawn linguine, my son in law had the risotto, my daughter the gnocchi. Every dish was excellent hot and tasty. My daughter and her husband are both chefs and were impressed with both the main courses and the desserts. Tiramisu and cheesecake.',
      foodRating: 4,
      serviceRating: 4,
      ambienceRating: 4,
    },
    {
      rating: 4,
      name: 'Roshan Acharya',
      reviewText: 'We all had different main courses. I had the ragu, my wife had the prawn linguine, my son in law had the risotto, my daughter the gnocchi. Every dish was excellent hot and tasty. My daughter and her husband are both chefs and were impressed with both the main courses and the desserts. Tiramisu and cheesecake.',
      foodRating: 4,
      serviceRating: 4,
      ambienceRating: 4,
    },
    {
      rating: 4,
      name: 'Roshan Acharya',
      reviewText: 'We all had different main courses. I had the ragu, my wife had the prawn linguine, my son in law had the risotto, my daughter the gnocchi. Every dish was excellent hot and tasty. My daughter and her husband are both chefs and were impressed with both the main courses and the desserts. Tiramisu and cheesecake.',
      foodRating: 4,
      serviceRating: 4,
      ambienceRating: 4,
    },
    {
      rating: 4,
      name: 'Roshan Acharya',
      reviewText: 'We all had different main courses. I had the ragu, my wife had the prawn linguine, my son in law had the risotto, my daughter the gnocchi. Every dish was excellent hot and tasty. My daughter and her husband are both chefs and were impressed with both the main courses and the desserts. Tiramisu and cheesecake.',
      foodRating: 4,
      serviceRating: 4,
      ambienceRating: 4,
    },
    {
      rating: 4,
      name: 'Roshan Acharya',
      reviewText: 'We all had different main courses. I had the ragu, my wife had the prawn linguine, my son in law had the risotto, my daughter the gnocchi. Every dish was excellent hot and tasty. My daughter and her husband are both chefs and were impressed with both the main courses and the desserts. Tiramisu and cheesecake.',
      foodRating: 4,
      serviceRating: 4,
      ambienceRating: 4,
    },
    // Add more review objects here if needed
  ];

  return (
    <div className="ratings">
      <h1>Overall Rating</h1>
      <div className="overall-rating">
        <span className="number">4.5 <span className='stars'>★</span></span>
      </div>
      <div className="category-ratings">
        <div>
          <h2>Food</h2>
          <span className="number">4.5 <span className='stars'>★</span></span>
        </div>
        <div>
          <h2>Service</h2>
          <span className="number">4.5 <span className='stars'>★</span></span>
        </div>
        <div>
          <h2>Ambience</h2>
          <span className="number">4.5 <span className='stars'>★</span></span>
        </div>
      </div>
      {reviews.slice(0, showAll ? reviews.length : 3).map((review, index) => (
        <Review key={index} {...review} />
      ))}
      <div className="show-all" onClick={() => setShowAll(!showAll)}>
        <span>{showAll ? 'Show Less' : 'Show All'}</span>
      </div>
    </div>
  );
};

export default Ratings;

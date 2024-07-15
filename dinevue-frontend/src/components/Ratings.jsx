import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllReviewsApi } from '../apis/Api'; // Adjust the import according to your project structure
import '../style/Ratings.css';

const Review = ({ OverallRating, UserName, ReviewText, FoodRating, ServiceRating, AmbienceRating }) => (
  <div className="review">
    <div className="review-header">
      <span className="stars">{OverallRating} ★</span>
      <span className="name">{UserName}</span>
    </div>
    <div className="review-ratings">
      <span className="overall">Overall: {OverallRating}</span>
      <span className="food">Food: {FoodRating}</span>
      <span className="service">Service: {ServiceRating}</span>
      <span className="ambience">Ambience: {AmbienceRating}</span>
    </div>
    <p>{ReviewText}</p>
  </div>
);

const Ratings = () => {
  const { id } = useParams(); // Get restaurant ID from URL
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averages, setAverages] = useState({
    overall: 0,
    food: 0,
    service: 0,
    ambience: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllReviewsApi();
        const allReviews = response.data.data;
        const filteredReviews = allReviews.filter(review => review.RestaurantId === parseInt(id));
        setReviews(filteredReviews);
        setLoading(false);

        if (filteredReviews.length > 0) {
          const totalOverall = filteredReviews.reduce((acc, review) => acc + review.OverallRating, 0);
          const totalFood = filteredReviews.reduce((acc, review) => acc + review.FoodRating, 0);
          const totalService = filteredReviews.reduce((acc, review) => acc + review.ServiceRating, 0);
          const totalAmbience = filteredReviews.reduce((acc, review) => acc + review.AmbienceRating, 0);

          setAverages({
            overall: (totalOverall / filteredReviews.length).toFixed(1),
            food: (totalFood / filteredReviews.length).toFixed(1),
            service: (totalService / filteredReviews.length).toFixed(1),
            ambience: (totalAmbience / filteredReviews.length).toFixed(1),
          });
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Error fetching reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="ratings">
      <h1>Overall Rating</h1>
      <div className="overall-rating">
        <span className="number">{averages.overall} <span className='stars'>★</span></span>
      </div>
      <div className="category-ratings">
        <div>
          <h2>Food</h2>
          <span className="number">{averages.food} <span className='stars'>★</span></span>
        </div>
        <div>
          <h2>Service</h2>
          <span className="number">{averages.service} <span className='stars'>★</span></span>
        </div>
        <div>
          <h2>Ambience</h2>
          <span className="number">{averages.ambience} <span className='stars'>★</span></span>
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

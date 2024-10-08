import React, { useRef, useState, useEffect } from 'react';
import { MdRateReview } from 'react-icons/md';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import Ratings from './Ratings';
import PopularDishes from './PopularDishes';
import Photos from './Photos';
import Menu from './Menu';
import '../style/Restaurant_View.css';
import { getAllReviewsApi } from '../apis/Api'; // Adjust the import according to your project structure

const RestaurantInfo = ({ restaurant }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  const overviewRef = useRef(null);
  const popularDishesRef = useRef(null);
  const photosRef = useRef(null);
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllReviewsApi(); // Fetch all reviews
        const reviews = response.data.data; // Access the nested data property
  
        console.log('API Response:', response); // Log full response
        console.log('Reviews Array:', reviews); // Log the extracted reviews array
  
        // Check if reviews is an array
        if (Array.isArray(reviews)) {
          // Filter reviews where RestaurantId matches the current restaurant's id
          const filteredReviews = reviews.filter(review => review.RestaurantId === restaurant.id);
          console.log('Filtered Reviews:', filteredReviews);
  
          setReviewCount(filteredReviews.length); // Update state with the count of matching reviews
        } else {
          console.error('Expected an array of reviews but got:', reviews);
          setReviewCount(0); // Set count to 0 if reviews is not an array
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
  
    if (restaurant && restaurant.id) {
      fetchReviews();
    }
  }, [restaurant.id]);
  
    
  

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const handleNavClick = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

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

  return (
    <div ref={overviewRef} className="restaurant-info">
      <nav className="nav-bar">
        <a href="#overview" onClick={() => handleNavClick(overviewRef)}>Overview</a>
        <a href="#popular-dishes" onClick={() => handleNavClick(popularDishesRef)}>Popular Dishes</a>
        <a href="#photos" onClick={() => handleNavClick(photosRef)}>Photos</a>
        <a href="#menu" onClick={() => handleNavClick(menuRef)}>Menu</a>
        <a href="#review" onClick={() => handleNavClick(reviewsRef)}>Review</a>
      </nav>
      <h1>{restaurant.restaurantName}</h1>
      <div className="rating">
        <div className="stars">
          {renderRatingStars(restaurant.rating)}
        </div>
        <div className="reviews">
          <MdRateReview className="search-icon" />
          {reviewCount} Reviews
        </div>
        <div className="category">
          <GiForkKnifeSpoon className="search-icon" />
          {restaurant.foods.join(', ')}
        </div>
      </div>
      <div className="tags">
        {restaurant.tags.map((tag, index) => (
          <span key={index} className="view_tag">{tag}</span>
        ))}
      </div>
      <p className="description">
        {isExpanded ? restaurant.description : `${restaurant.description.substring(0, 200)}...`}
        <span className="read-more-less" onClick={toggleReadMore}>
          {isExpanded ? ' Read Less' : ' Read More'}
        </span>
      </p>
      <div ref={popularDishesRef}>
        <PopularDishes popularDishes={restaurant.popularDishes} dishesphotos={restaurant.dishesphotos} />
      </div>
      <div ref={photosRef}>
        <Photos photos={restaurant.photos} />
      </div>
      <div ref={menuRef}>
        <Menu menuPhotos={restaurant.menuPhotos} />
      </div>
      <h2 ref={reviewsRef}>Reviews</h2>
      <Ratings />
    </div>
  );
};

export default RestaurantInfo;

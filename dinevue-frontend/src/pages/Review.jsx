import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { CgProfile } from "react-icons/cg";
import { getSingleRestaurantApi, createReviewApi } from '../apis/Api'; // Adjust the import according to your project structure
import ProfileForm from '../components/ProfileForm';
import '../style/Review.css';
import Noscrollnav from '../components/noscroll';

const Review = () => {
    const [activeItem, setActiveItem] = useState('Profile');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [restaurant, setRestaurant] = useState(null);
    const { id } = useParams(); // Get restaurant ID from URL

    const [foodRating, setFoodRating] = useState(5);
    const [serviceRating, setServiceRating] = useState(5);
    const [ambienceRating, setAmbienceRating] = useState(5);
    const [overallRating, setOverallRating] = useState(5);
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        // Retrieve firstName and lastName from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setFirstName(userData.firstName || ''); // Set default value if firstName is not available
            setLastName(userData.lastName || ''); // Set default value if lastName is not available
        }

        // Fetch restaurant details
        const fetchRestaurantDetails = async () => {
            try {
                const response = await getSingleRestaurantApi(id);
                setRestaurant(response.data.data); // Adjusting to access the nested 'data' property
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };

        fetchRestaurantDetails();
    }, [id]);

    const handleSidebarClick = (item) => {
        setActiveItem(item);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            console.error('No user data found in local storage');
            toast.error('You need to log in to submit a review.');
            return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.id;
        const userName = `${firstName} ${lastName}`;

        const reviewData = {
            FoodRating: foodRating,
            ServiceRating: serviceRating,
            AmbienceRating: ambienceRating,
            OverallRating: overallRating,
            ReviewText: reviewText,
            UserId: userId,
            RestaurantId: id,
            UserName: userName // Pass UserName here
        };

        try {
            const response = await createReviewApi(reviewData);
            if (response.status === 201) {
                console.log('Review created successfully');
                toast.success('Review submitted successfully!');
                // Optionally reset form or show success message
            } else {
                console.error('Failed to create review:', response.data.message);
                toast.error('An error occurred while submitting your review.');
            }
        } catch (error) {
            console.error('Error creating review:', error);
            toast.error('An error occurred while submitting your review.');
        }
    };

    const renderContent = () => {
        switch (activeItem) {
            case 'Profile':
                return <ProfileForm />;
            // Add cases for other items if needed
            default:
                return <ProfileForm />;
        }
    };

    return (
        <>
            <Noscrollnav />
            <ToastContainer />
            <div className="profile-container">
                <div className="profile-header">
                    <div>
                        <div className="profile-picture">
                            <CgProfile />
                        </div>
                        <h2 className="profile-text">Hi, {firstName || 'User'}</h2>
                    </div>
                </div>
                <div className="review-page">
                    <div className="review-header">
                        <Link to={`/profile`} className="back-arrow">
                            <span>&larr;</span>
                        </Link>
                        <h1>Ratings & Review</h1>
                    </div>
                    <div className="review-container">
                        <div className="review-card">
                            <form className="review-form" onSubmit={handleSubmit}>
                                <div className="restaurant-info-review">
                                    {restaurant ? (
                                        <>
                                            <img src={restaurant.coverphoto} alt="Restaurant" className="restaurant-image" />
                                            <div>
                                                <h3>{restaurant.restaurantName}</h3>
                                                <p>{restaurant.address}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Food</label>
                                        <select value={foodRating} onChange={(e) => setFoodRating(Number(e.target.value))}>
                                            <option value={5}>5 ★</option>
                                            <option value={4}>4 ★</option>
                                            <option value={3}>3 ★</option>
                                            <option value={2}>2 ★</option>
                                            <option value={1}>1 ★</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Service</label>
                                        <select value={serviceRating} onChange={(e) => setServiceRating(Number(e.target.value))}>
                                            <option value={5}>5 ★</option>
                                            <option value={4}>4 ★</option>
                                            <option value={3}>3 ★</option>
                                            <option value={2}>2 ★</option>
                                            <option value={1}>1 ★</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Ambience</label>
                                        <select value={ambienceRating} onChange={(e) => setAmbienceRating(Number(e.target.value))}>
                                            <option value={5}>5 ★</option>
                                            <option value={4}>4 ★</option>
                                            <option value={3}>3 ★</option>
                                            <option value={2}>2 ★</option>
                                            <option value={1}>1 ★</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Overall</label>
                                        <select value={overallRating} onChange={(e) => setOverallRating(Number(e.target.value))}>
                                            <option value={5}>5 ★</option>
                                            <option value={4}>4 ★</option>
                                            <option value={3}>3 ★</option>
                                            <option value={2}>2 ★</option>
                                            <option value={1}>1 ★</option>
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Review</label>
                                        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write about your experience (Optional)"></textarea>
                                    </div>
                                </div>
                                <button type="submit">Submit Review</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Review;

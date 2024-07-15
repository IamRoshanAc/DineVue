import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/SearchView.css';
import Footer from '../components/footer';
import SearchBar from '../components/Search';
import Noscrollnav from '../components/noscroll';
import { getAllRestaurantApi } from '../apis/Api'; // Import your API function

const SearchView = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDiningOptions, setSelectedDiningOptions] = useState([]);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [sortOption, setSortOption] = useState('Top Rated');
    const [cuisines, setCuisines] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search).get('query');
        if (query) {
            setSearchQuery(query);
        }
    }, [location]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await getAllRestaurantApi(token);
                if (response.data.success) {
                    const approvedRestaurants = response.data.data.filter(restaurant => restaurant.approved);
                    setRestaurants(approvedRestaurants);

                    // Extract unique cuisines from restaurant data
                    const allCuisines = approvedRestaurants.flatMap(restaurant => restaurant.foods || []);
                    const uniqueCuisines = [...new Set(allCuisines)];
                    setCuisines(uniqueCuisines);
                } else {
                    toast.error("Failed to fetch restaurants");
                }
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                toast.error("Failed to fetch restaurants. Please check your network and try again.");
            }
        };

        fetchRestaurants();
    }, []);

    // Handle the search input change from SearchBar component
    const handleSearchChange = (query) => {
        setSearchQuery(query);
        navigate(`?query=${query}`);
    };

    // Handle checkbox change for dining options
    const handleDiningOptionChange = (event) => {
        const { value, checked } = event.target;
        setSelectedDiningOptions((prev) =>
            checked ? [...prev, value] : prev.filter((option) => option !== value)
        );
    };

    // Handle checkbox change for cuisines
    const handleCuisineChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCuisines((prev) =>
            checked ? [...prev, value] : prev.filter((cuisine) => cuisine !== value)
        );
    };

    // Handle sort option change
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    // Filter restaurants based on search query, dining options, and cuisines
    const filteredRestaurants = restaurants.filter((restaurant) => {
        const query = searchQuery.toLowerCase();
        const matchesSearchQuery = query === '' || restaurant.restaurantName?.toLowerCase().includes(query) || restaurant.address?.toLowerCase().includes(query);
        const matchesDiningOptions = selectedDiningOptions.every(option =>
            restaurant.seatingDetails?.some(seating => seating.type === option)
        );
        const matchesCuisines = selectedCuisines.every(cuisine => restaurant.foods?.includes(cuisine));
        return matchesSearchQuery && matchesDiningOptions && matchesCuisines;
    });

    // Sort filtered restaurants based on selected sort option
    const sortedRestaurants = filteredRestaurants.sort((a, b) => {
        if (sortOption === 'Top Rated') {
            return b.rating - a.rating;
        }
        if (sortOption === 'New') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // Add more sort options as needed
        return 0;
    });

    // Function to render star ratings
    const renderRatingStars = (rating) => {
        const filledStars = Math.round(rating); // Round to nearest whole star
        const totalStars = 5;
        const stars = [];

        // Render filled stars
        for (let i = 0; i < filledStars; i++) {
            stars.push(<span key={`filled-${i}`} className="search-star filled">&#9733;</span>);
        }

        // Render empty stars
        for (let i = filledStars; i < totalStars; i++) {
            stars.push(<span key={`empty-${i}`} className="search-star">&#9734;</span>);
        }

        return stars;
    };

    return (
        <>
            <Noscrollnav />
            <SearchBar onSearchChange={handleSearchChange} />
            <div className="search-sort-options">
                <label>
                    Sort By:
                    <select value={sortOption} onChange={handleSortChange}>
                        <option value="Top Rated">Top Rated</option>
                        <option value="New">New</option>
                        {/* Add more sort options as needed */}
                    </select>
                </label>
            </div>
            <div className="search-view">
                <div className="search-filters">
                    <div className="search-filter-group">
                        <h2>Dining Options</h2>
                        <label>
                            <input type="checkbox" value="Bar" onChange={handleDiningOptionChange} /> Bar
                        </label>
                        <label>
                            <input type="checkbox" value="Standard" onChange={handleDiningOptionChange} /> Standard
                        </label>
                        <label>
                            <input type="checkbox" value="Outdoor" onChange={handleDiningOptionChange} /> Outdoor
                        </label>
                    </div>
                    <div className="search-filter-group">
                        <h2>Cuisines</h2>
                        {cuisines.map((cuisine) => (
                            <label key={cuisine}>
                                <input type="checkbox" value={cuisine} onChange={handleCuisineChange} /> {cuisine}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="search-restaurant-list">
                    {sortedRestaurants.map((restaurant) => (
                        <div key={restaurant.id} className="search-restaurant-card">
                            <Link to={`/restaurant_view/${restaurant.id}`}>
                                <img
                                    src={restaurant.coverphoto}
                                    alt={restaurant.restaurantName}
                                    className="search-card-img-top"
                                />
                            </Link>
                            <div className="search-card-body">
                                <h5 className="search-card-title">{restaurant.restaurantName}</h5>
                                <div className="rating-slider">{renderRatingStars(restaurant.rating)}</div>
                                <p className="search-card-text">{restaurant.address}</p>
                                <div className="tags">
                                    {restaurant.seatingDetails?.map((seating, index) => (
                                        <span key={index} className="view_tag">{seating.type}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
};

export default SearchView;

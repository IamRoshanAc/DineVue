import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../style/Search.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
  const navigate = useNavigate(); // Hook to get the navigate function

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`); // Redirect with search query
    }
  };

  return (
    <div className="search-bar-container">
      <h1 className="title">Let's find your ideal table</h1>
      <div className="search-row">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            className="searchbar-input" 
            placeholder="Search Restaurant" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
          />
        </div>
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default SearchBar;

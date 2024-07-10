import React from 'react';
import '../style/Search.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
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
          />
        </div>
        <button className="search-button">Search</button>
      </div>
    </div>
  );
};

export default SearchBar;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Search.css';
import { FaSearch } from 'react-icons/fa';

const Security = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="search-bar-container">
      <h1 className="title">Let's find your ideal table</h1>
      <div className="search-row">

        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default Security;

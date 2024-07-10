import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Navbar.css';
import { FaCalendar, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import logo from '../images/nav_logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-right">
        <FaCalendar className="navbar-icon" />
        <div className="profile-dropdown">
          <FaUserCircle className="navbar-icon" />
          <button
            className="btn dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li><a className="dropdown-item" href="/profile">Profile</a></li>
            <li><a className="dropdown-item" href="#">Change Password</a></li>
            <li><a className="dropdown-item" href="#">Saved Restaurants</a></li>
            <li><a className="dropdown-item" href="#">Reservations</a></li>
            <li><a className="dropdown-item" href="#">Dining History</a></li>
            <li><button onClick={handleLogout}
                          className="dropdown-item"
                          to="/logout">Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/noscroll.css';
import { FaCalendar, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import logo from '../images/nav_logo.png';
import Tooltip from './Tooltip';

const Noscrollnav = () => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowDialog(true);
  };

  const handleConfirmLogout = () => {
    setShowDialog(false);
    localStorage.clear();
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setShowDialog(false);
  };

  const handleIconClick = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={'/home'}>
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>
      <div className="navbar-right">
        <div 
          className="nav-icon-container" 
          onClick={handleIconClick}
        >
          <FaCalendar className="navbar-icon" />
          <Tooltip show={showTooltip} />
        </div>
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
            <li><a className="dropdown-item" href="/Profile">Profile</a></li>
            <li>
              <button 
                onClick={handleLogoutClick}
                className="dropdown-item"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>Are you sure you want to Log out?</p>
            <button onClick={handleConfirmLogout}>Yes</button>
            <button onClick={handleCancelLogout}>No</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Noscrollnav;

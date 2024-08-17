import React, { useState } from 'react';
import '../style/Navbar.css';
import logo from '../images/nav_logo.png';
import { Link, useNavigate } from 'react-router-dom';

const NavbarAdmin = () => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowDialog(true);
  };

  const handleConfirmLogout = () => {
    setShowDialog(false);
    navigate('/restaurant_log');
  };

  const handleCancelLogout = () => {
    setShowDialog(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={'/index'}>
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>
      <Link to="/audits" className="login-button">Audit Logs</Link>
      <div className="navbar-right">
        <div className="button-container">
          <button className="logout-button" onClick={handleLogoutClick}>Log Out</button>
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

export default NavbarAdmin;

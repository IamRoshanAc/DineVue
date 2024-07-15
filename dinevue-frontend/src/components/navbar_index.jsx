import React from 'react';
import '../style/Navbar.css';
import logo from '../images/nav_logo.png';
import { Link } from 'react-router-dom';

const NavbarIndex = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      <Link to={'/index'}>
        <img src={logo} alt="Logo" href="" className="navbar-logo" />
        </Link>
        
      </div>
      <div className="navbar-right">
      <div className="button-container">
      <Link to="/login" className="login-button">Login</Link>
      <Link to="/register" className="signup-button">SignUp</Link>
    </div>
        
      </div>
    </nav>
  );
};

export default NavbarIndex;

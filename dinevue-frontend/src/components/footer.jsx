import React from 'react';
import '../style/Footer.css';
import logo from '../images/logo_without_name.png'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="logo-section">
                    <div className="logo">
                        <img src={logo} alt="DineVue Logo" />
                    </div>
                    <p className="brand-name">DineVue</p>
                </div>
                <div className="links-section">
                    <div className="links-column">
                        <h3>DISCOVER</h3>
                        <a href="#">Popular</a>
                        <a href="#">Top Rated</a>
                        <a href="#">New</a>
                    </div>
                    <div className="links-column">
                        <h3>DINEVUE</h3>
                        <a href="#">About Us</a>
                    </div>
                    <div className="links-column">
                        <h3>SUPPORT</h3>
                        <a href="#">FAQs</a>
                    </div>
                    <div className="links-column">
                        <h3>BUSINESS</h3>
                        <a href="#">Register your Restaurant</a>
                        <a href="#">Login as a Restaurant</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Roshan Acharya. All Rights Reserved, 2024</p>
                <div className="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Sitemap</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

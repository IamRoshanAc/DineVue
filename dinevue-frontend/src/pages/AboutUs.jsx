import React from 'react';
import '../style/AboutUs.css'; // Ensure you create this CSS file
import Footer from '../components/footer';
import Noscrollnav from '../components/noscroll';
import { FaUserFriends, FaLightbulb, FaHandsHelping, FaStar } from 'react-icons/fa'; // Example icons
import Logo from '../images/logo.png';
import Aboutus from '../images/abouUs.png';

const AboutUs = () => {
  return (
    <>
      <Noscrollnav />
      <div className="aboutus-container">
        <section className="aboutus-intro">
          <div className="aboutus-text">
            <h1>Welcome to DineVue</h1>
            <p>
              DineVue is your premier reservation management platform, bridging the gap between diners and restaurant management.
              Our mission is to provide a seamless and efficient booking experience for customers while helping restaurants optimize their reservations and enhance customer satisfaction.
            </p>
          </div>
          <div className="aboutus-image">
            <img src={Logo} alt="DineVue Overview" />
          </div>
        </section>
        <section className="aboutus-mission">
          <h2>Our Mission</h2>
          <div className="mission-image">
            <img src={Aboutus} alt="Mission" />
          </div>
          <p>
            At DineVue, we believe in making dining out a delightful experience for everyone. We are committed to connecting diners with their favorite restaurants through our innovative reservation system. Our platform is designed to simplify the booking process, manage reservations effectively, and provide a user-friendly interface for both customers and restaurant staff.
          </p>
        </section>
        <section className="aboutus-values">
          <h2>Our Values</h2>
          <div className="values-list">
            <div className="value-item">
              <FaUserFriends className="value-icon left" />
              <div className="value-text">
                <h3>Customer Focus</h3>
                <p>We prioritize the needs of our customers and strive to exceed their expectations.</p>
              </div>
            </div>
            <div className="value-item-right">
              <div className="value-text">
                <h3>Innovation</h3>
                <p>We continually innovate to improve our services and provide cutting-edge solutions.</p>
              </div>
              <FaLightbulb className="value-icon right" />
            </div>
            <div className="value-item">
              <FaHandsHelping className="value-icon left" />
              <div className="value-text">
                <h3>Integrity</h3>
                <p>We operate with honesty and transparency in all our interactions.</p>
              </div>
            </div>
            <div className="value-item-right">
              <div className="value-text">
                <h3>Excellence</h3>
                <p>We aim for excellence in every aspect of our platform and services.</p>
              </div>
              <FaStar className="value-icon right" />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;

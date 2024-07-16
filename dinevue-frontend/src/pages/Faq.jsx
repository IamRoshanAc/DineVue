import React, { useState } from 'react';
import '../style/Faq.css';
import Footer from '../components/footer';
import Noscrollnav from '../components/noscroll';
import NavbarIndex from '../components/navbar_index';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: 'How can I submit my review', answer: 'To submit your review, go to your profile and then select dining history and click on the review icon of retaurant which you want to review.' },
    { question: 'How to cancel my reservations?', answer: 'To cancel your resrvation, go to your profile and select reservation and there you can see cancel button to cancel your reservation' },
    { question: 'How to know the location of Restaurants', answer: 'While viewing any restaurant, you can see a location map below reservation where you can zoom out or zoom in to see the exact location of the restaurant' },
    { question: 'How to register restaurant account', answer: 'To register as a restaurant, go to footer and click in Register as an restaurant where you will submit the details of your restaurant and when it is approved by us you can get started with your business' },
    // Add more questions and answers here
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-image">
        <img src="https://www.innsight.com/assets/user_images/files/What-is-an-FAQ-Page.jpg" alt="FAQ Image" />
      </div>
      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
            </div>
            <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const token = localStorage.getItem('token');

const Home = () => {
  return (
    <>
      {token ? <Noscrollnav /> : <NavbarIndex />}
      <FAQ />
      <Footer />
    </>
  );
};

export default Home;

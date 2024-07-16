import React, { useRef } from 'react';
import Navbar from '../components/navbar';
import '../style/Home.css';
import Footer from '../components/footer';
import SearchBar from '../components/Search';
import PopularSlider from '../components/PopularSlider';
import TopSlider from '../components/TopSliders';
import NewSlider from '../components/NewSlider';
import Noscrollnav from '../components/noscroll';
import NavbarIndex from '../components/navbar_index';

const Index = () => {
  const token = localStorage.getItem('token');
  const popularRef = useRef(null);
  const topRatedRef = useRef(null);
  const newRef = useRef(null);

  const scrollToPopular = (event) => {
    event.preventDefault();
    if (popularRef.current) {
      popularRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTopRated = (event) => {
    event.preventDefault();
    if (topRatedRef.current) {
      topRatedRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNew = (event) => {
    event.preventDefault();
    if (newRef.current) {
      newRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {token ? <Noscrollnav /> : <NavbarIndex />}
      <SearchBar />
      <br />
      <div ref={popularRef}>
        <PopularSlider />
      </div>
      <br />
      <div ref={topRatedRef}>
        <TopSlider />
      </div>
      <br />
      <div ref={newRef}>
        <NewSlider />
      </div>
      <br />
      <br />
      <br />
      <Footer
        scrollToPopular={scrollToPopular}
        scrollToTopRated={scrollToTopRated}
        scrollToNew={scrollToNew}
      />
    </>
  );
};

export default Index;

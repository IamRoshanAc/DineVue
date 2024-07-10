import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../style/RestaurantDetails.css';

const RestaurantDetails = () => {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [foodTypes, setFoodTypes] = useState('');
  const [popularDishes, setPopularDishes] = useState([{ name: '', image: null }]);
  const [photos, setPhotos] = useState([]);
  const [menuPhotos, setMenuPhotos] = useState([]);

  const navigate = useNavigate();

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleTagChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setTags(value.slice(0, 3));
  };

  const handlePopularDishChange = (index, field, value) => {
    const updatedDishes = [...popularDishes];
    updatedDishes[index][field] = value;
    setPopularDishes(updatedDishes);
  };

  const addPopularDish = () => {
    if (popularDishes.length < 3) {
      setPopularDishes([...popularDishes, { name: '', image: null }]);
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setPhotos(files);
  };

  const handleMenuPhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setMenuPhotos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to save the restaurant details
      toast.success('Details saved successfully');
      navigate('/success'); // Navigate to a success page or dashboard
    } catch (error) {
      toast.error('Failed to save details');
    }
  };

  return (
    <div className="details-page">
      <h2>Restaurant Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description about restaurant:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange(setDescription)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (choose up to 3):</label>
          <select id="tags" name="tags" multiple value={tags} onChange={handleTagChange} required>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="Japanese">Japanese</option>
            <option value="Thai">Thai</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="foodTypes">Type of foods in the restaurant:</label>
          <input
            type="text"
            id="foodTypes"
            name="foodTypes"
            value={foodTypes}
            onChange={handleChange(setFoodTypes)}
            required
          />
        </div>
        <div className="form-group">
          <label>Popular Dishes (up to 3):</label>
          {popularDishes.map((dish, index) => (
            <div key={index} className="popular-dish">
              <input
                type="text"
                placeholder="Dish name"
                value={dish.name}
                onChange={(e) => handlePopularDishChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="file"
                onChange={(e) => handlePopularDishChange(index, 'image', e.target.files[0])}
                required
              />
            </div>
          ))}
          {popularDishes.length < 3 && (
            <button type="button" onClick={addPopularDish}>
              Add Another Dish
            </button>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="photos">Upload Photos (up to 4):</label>
          <input
            type="file"
            id="photos"
            name="photos"
            multiple
            onChange={handlePhotoChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="menuPhotos">Upload Menu Photos:</label>
          <input
            type="file"
            id="menuPhotos"
            name="menuPhotos"
            multiple
            onChange={handleMenuPhotoChange}
            required
          />
        </div>
        <button className="details-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RestaurantDetails;

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import '../../style/RestaurantReg.css';
import backgroundImage from '../../images/Untitled design (4).png';
import { createRestaurantApi } from '../../apis/Api';
import L from 'leaflet';



const RestaurantReg = () => {
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantEmail, setRestaurantEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [foods, setFoods] = useState('');
    const [location, setLocation] = useState([51.505, -0.09]); // Default location (latitude, longitude)
    const [popularDishes, setPopularDishes] = useState([{ name: '' }]);
    const [photos, setPhotos] = useState([]);
    const [coverphoto, setCoverPhoto] = useState([]);
    const [menuPhotos, setMenuPhotos] = useState([]);
    const [seatingDetails, setSeatingDetails] = useState([{ type: '', options: { '1person': 0, '2people': 0, '4people': 0, '6people': 0 } }]);

    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleTagChange = (e) => {
        const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
        if (selectedTags.length <= 3) {
            setTags(selectedTags);
        } else {
            toast.error('You can select up to 3 tags');
        }
    };

    const handlePopularDishesChange = (index) => (e) => {
        const updatedDishes = [...popularDishes];
        updatedDishes[index] = { ...updatedDishes[index], name: e.target.value };
        setPopularDishes(updatedDishes);
    };

    const addPopularDish = () => {
        setPopularDishes([...popularDishes, { name: '' }]);
    };

    const handlePhotoUpload = (e) => {
        const uploadedPhotos = Array.from(e.target.files);
        setPhotos(uploadedPhotos);
    };
    const handleCoverPhotoUpload = (e) => {
        const uploadedCoverPhoto = Array.from(e.target.files);
        setCoverPhoto(uploadedCoverPhoto);
    };

    const handleMenuPhotoUpload = (e) => {
        const uploadedMenuPhotos = Array.from(e.target.files);
        setMenuPhotos(uploadedMenuPhotos);
    };

    const handleSeatingDetailsChange = (index, field) => (e) => {
        const updatedSeatingDetails = [...seatingDetails];
        updatedSeatingDetails[index][field] = e.target.value;
        setSeatingDetails(updatedSeatingDetails);
    };

    const handleSeatingOptionsChange = (index, option) => (e) => {
        const updatedSeatingDetails = [...seatingDetails];
        updatedSeatingDetails[index].options[option] = parseInt(e.target.value);
        setSeatingDetails(updatedSeatingDetails);
    };

    const addSeatingType = () => {
        setSeatingDetails([...seatingDetails, { type: '', options: { '1person': 0, '2people': 0, '4people': 0, '6people': 0 } }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step === 1) {
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            // Proceed to next step
            setStep(2);
        } else if (step === 2) {
            // Proceed to next step
            setStep(3);
        } else if (step === 3) {
            try {
                const response = await createRestaurantApi({
                    restaurantName,
                    restaurantEmail,
                    phone,
                    address,
                    password,
                    description,
                    tags,
                    foods,
                    location,
                    popularDishes,
                    photos,
                    coverphoto,
                    menuPhotos,
                    seatingDetails,
                });
                if (response.status === 201) {
                    toast.success('Restaurant registered successfully');
                    navigate('/restaurant_log'); // Navigate to dashboard or any other page
                } else {
                    toast.error('Registration failed');
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Server error');
                }
            }
        }
    };

    const LocationMarker = () => {
        const map = useMapEvents({
            click(e) {
                setLocation([e.latlng.lat, e.latlng.lng]);
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        return location === null ? null : (
            <Marker position={location}>
            </Marker>
        );
    };

    const goToPreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const goToNextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    return (
        <div className="registration-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="registration-container">
                <div className="registration-form">
                    <div className="progress-indicator">
                        <span className="arrow-icon" onClick={goToPreviousStep}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </span>
                        <span className={step === 1 ? 'active' : ''}>1</span>
                        <span className={step === 2 ? 'active' : ''}>2</span>
                        <span className={step === 3 ? 'active' : ''}>3</span>
                        <span className="arrow-icon" onClick={goToNextStep}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                    </div>
                    {step === 1 && (
                        <>
                            <h2 className="form-title">Register</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="restaurantName">Restaurant Name:</label>
                                    <input
                                        type="text"
                                        id="restaurantName"
                                        name="restaurantName"
                                        value={restaurantName}
                                        onChange={handleChange(setRestaurantName)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="restaurantEmail">Restaurant Email:</label>
                                    <input
                                        type="email"
                                        id="restaurantEmail"
                                        name="restaurantEmail"
                                        value={restaurantEmail}
                                        onChange={handleChange(setRestaurantEmail)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Contact Number:</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={phone}
                                        onChange={handleChange(setPhone)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address:</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={address}
                                        onChange={handleChange(setAddress)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <div className="password-container">
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={handleChange(setPassword)}
                                            required
                                        />
                                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                                            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password:</label>
                                    <div className="password-container">
                                        <input
                                            type={confirmPasswordVisible ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleChange(setConfirmPassword)}
                                            required
                                        />
                                        <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                                            <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
                                        </span>
                                    </div>
                                </div>
                                <button className="registration-button" type="submit">
                                    Next
                                </button>
                            </form>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <h2 className="form-title">Additional Information</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="description">Restaurant Description:</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={description}
                                        onChange={handleChange(setDescription)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tags">Restaurant Tags (up to 3):</label>
                                    <select
                                        id="tags"
                                        name="tags"
                                        multiple
                                        value={tags}
                                        onChange={handleTagChange}
                                        required
                                    >
                                        <option value="Italian">Italian</option>
                                        <option value="Chinese">Chinese</option>
                                        <option value="Mexican">Mexican</option>
                                        <option value="Indian">Indian</option>
                                        <option value="Vegetarian">Vegetarian</option>
                                        <option value="Vegan">Vegan</option>
                                        <option value="Seafood">Seafood</option>
                                    </select>
                                    <div className="selected-tags">
                                        {tags.map((tag, index) => (
                                            <span key={index} className="tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="foods">Main Dish</label>
                                    <input
                                        type="text"
                                        id="foods"
                                        name="foods"
                                        value={foods}
                                        onChange={handleChange(setFoods)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="location">Location:</label>
                                    <MapContainer
                                        center={location}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        style={{ height: '300px', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationMarker />
                                    </MapContainer>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="popularDishes">Popular Dishes (up to 3)</label>
                                    {popularDishes.map((dish, index) => (
                                        <div key={index} className="form-group">
                                            <input
                                                type="text"
                                                value={dish.name}
                                                onChange={handlePopularDishesChange(index)}
                                                placeholder="Dish Name"
                                                required
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handlePhotoUpload(e)}
                                            />
                                        </div>
                                    ))}
                                    <button type="button" onClick={addPopularDish}>
                                        Add Another Dish
                                    </button>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="coverphotos">Cover Photo</label>
                                    <input
                                        type="file"
                                        id="photos"
                                        name="photos"
                                        accept="image/*"
                                        multiple
                                        onChange={handleCoverPhotoUpload}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="photos">Max 4 photos:</label>
                                    <input
                                        type="file"
                                        id="photos"
                                        name="photos"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoUpload}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="menuPhotos">Menu Photos:</label>
                                    <input
                                        type="file"
                                        id="menuPhotos"
                                        name="menuPhotos"
                                        accept="image/*"
                                        multiple
                                        onChange={handleMenuPhotoUpload}
                                    />
                                </div>
                                <button className="registration-button" type="submit">
                                    Next
                                </button>
                            </form>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <h2 className="form-title">Seating Details</h2>
                            <form onSubmit={handleSubmit}>
                                {seatingDetails.map((seating, index) => (
                                    <div key={index} className="form-group">
                                        <label>Seating Type:</label>
                                        <input
                                            type="text"
                                            value={seating.type}
                                            onChange={handleSeatingDetailsChange(index, 'type')}
                                            placeholder="Seating Type"
                                            required
                                        />
                                        <label>1 Person Seats:</label>
                                        <input
                                            type="number"
                                            value={seating.options['1person']}
                                            onChange={handleSeatingOptionsChange(index, '1person')}
                                            required
                                        />
                                        <label>2 People Seats:</label>
                                        <input
                                            type="number"
                                            value={seating.options['2people']}
                                            onChange={handleSeatingOptionsChange(index, '2people')}
                                            required
                                        />
                                        <label>4 People Seats:</label>
                                        <input
                                            type="number"
                                            value={seating.options['4people']}
                                            onChange={handleSeatingOptionsChange(index, '4people')}
                                            required
                                        />
                                        <label>6 People Seats:</label>
                                        <input
                                            type="number"
                                            value={seating.options['6people']}
                                            onChange={handleSeatingOptionsChange(index, '6people')}
                                            required
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={addSeatingType}>
                                    Add Another Seating Type
                                </button>
                                <button className="registration-button" type="submit">
                                    Submit
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantReg;

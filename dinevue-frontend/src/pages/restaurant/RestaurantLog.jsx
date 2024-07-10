import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../style/RestaurantReg.css';
import backgroundImage from '../../images/Untitled design (4).png';
import { loginRestaurantApi } from '../../apis/Api'; // Ensure this API function is defined in your API module

const RestaurantLog = () => {
    const [restaurantEmail, setRestaurantEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleEmailChange = (e) => {
        setRestaurantEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginRestaurantApi({ restaurantEmail, password });
            if (response.status === 200) {
                const { token, user } = response.data;

                // Set token and user data in local storage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                toast.success('Login successful');

                setTimeout(() => {
                    navigate('/restaurant_dashboard'); // Redirect to the restaurant dashboard
                }, 2000); // Delay for 2 seconds to show the toast message
            } else {
                toast.error('Login failed');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Server error');
            }
        }
    };

    return (
        <div className="registration-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="registration-container">
                <div className="registration-form">
                    <h2 className="form-title">Restaurant Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="restaurantEmail">Restaurant Email:</label>
                            <input
                                type="email"
                                id="restaurantEmail"
                                name="restaurantEmail"
                                value={restaurantEmail}
                                onChange={handleEmailChange}
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
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <span className="toggle-password" onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                                </span>
                            </div>
                        </div>
                        <button className="registration-button" type="submit">
                            Login
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default RestaurantLog;

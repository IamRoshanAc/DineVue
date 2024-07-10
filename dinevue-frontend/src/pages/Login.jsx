import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Login.css';
import backgroundImage from '../images/Untitled design (4).png';
import logoImage from '../images/logo.png';
import { loginUserApi } from '../apis/Api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUserApi({ email, password });
      if (response.status === 200) {
        const { token, user } = response.data;

        // Set token and user data in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success('Login successful');

        setTimeout(() => {
          navigate('/home'); // Redirect to the home page
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
    <div className="login-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-container">
        <div className="login-left">
          <nametop className="text-5xl">Login</nametop>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email} 
                onChange={handleEmailChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="password-wrapper">
                <input 
                  type={passwordVisible ? "text" : "password"} 
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
              <div className="signup-link">
                Don't have an account? <a className="fw-bold" href="/register">Sign Up</a>
              </div>
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
          <div className="additional-links">
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>
        </div>
        <div className="login-right">
          <img src={logoImage} alt="DineVue Logo" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

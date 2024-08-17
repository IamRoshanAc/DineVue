import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import zxcvbn from 'zxcvbn'; // Import zxcvbn
import '../style/Register.css';
import Logo from '../images/DineDesk (2).png';
import { createUserApi } from '../apis/Api';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // State for password strength
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // Track password field focus

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

  const validateText = (text) => {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(text);
  };

  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const evaluatePasswordStrength = (password) => {
    const score = zxcvbn(password).score; // Calculate password strength
    setPasswordStrength(score);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    evaluatePasswordStrength(e.target.value);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setIsPasswordFocused(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateText(firstName) || !validateText(lastName)) {
      toast.error('First name and last name should only contain letters');
      return;
    }

    if (!validatePhone(phone)) {
      toast.error('Use a valid 10-digit phone number');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await createUserApi({
        firstName,
        lastName,
        email,
        phone,
        password
      });
      if (response.status === 201) {
        toast.success('Account created successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'yellow';
      case 4:
        return 'green';
      default:
        return 'red';
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <img src={Logo} className='logo'/>
          <br/>
          <h1 className="text-5xl">Register</h1>
          <br/>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={handleChange(setFirstName)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={handleChange(setLastName)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange(setEmail)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number:</label>
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
              <label htmlFor="password">Password:</label>
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  required
                />
                <span className="toggle-password" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                </span>
              </div>
              {/* Show the strength bar only when password field is focused or has value */}
              {(isPasswordFocused || password) && (
                <div className="password-strength-bar">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${(passwordStrength + 1) * 20}%`,
                      backgroundColor: getPasswordStrengthColor()
                    }}
                  ></div>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <div className="password-wrapper">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
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
            <div className="signup-link">
              Already have an account? <a className="fw-bold" href="/login">Login</a>
            </div>
            <button type="submit" className='register-button'>Create Account</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/ForgotPasswordModal.css';
import { requestResetCodeApi } from '../apis/Api';

const ForgotPasswordModa = ({ show, handleClose, onSuccess }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting email for password reset:", email);

    try {
      const response = await requestResetCodeApi({ email });
      console.log("API response:", response);

      if (response.data.success) {
        toast.success(response.data.message);
        onSuccess(email);
        handleClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Server Error");
      console.error("API error:", err.message);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        <div className="forgot-password-header">
          <h2>Enter your registered email address</h2>
          <button onClick={handleClose}>&times;</button>
        </div>
        <div className="forgot-password-content">
          <form onSubmit={handleSubmit} className="forgot-password-body">
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <button type="submit" className="forgot-password-button">
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModa;

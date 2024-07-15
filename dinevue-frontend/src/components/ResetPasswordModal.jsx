import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/ForgotPasswordModal.css';
import { resetPasswordApi } from '../apis/Api';

const ResetPasswordModal = ({ show, email, code, handleClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await resetPasswordApi({ email, code, newPassword });
      if (response.data.success) {
        toast.success(response.data.message);
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
      <div className="reset-password-modal">
        <div className="reset-password-header">
          <h2>Reset your password</h2>
          <button className="close" onClick={handleClose}>&times;</button>
        </div>
        <div className="reset-password-content">
          <form onSubmit={handleSubmit} className="reset-password-body">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <button type="submit" className="reset-password-button">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;

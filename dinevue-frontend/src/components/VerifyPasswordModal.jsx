import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/ForgotPasswordModal.css';
import { resetPasswordApi } from '../apis/Api';

const VerifyCodeModal = ({ show, email, handleClose, onSuccess }) => {
  const [code, setCode] = useState(['', '', '', '']);

  const handleCodeChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    console.log("Submitting verification code:", verificationCode);

    try {
      const response = await resetPasswordApi({ email, code: verificationCode });
      console.log("API response:", response);
      if (response.data.success) {
        toast.success(response.data.message);
        onSuccess(verificationCode);
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
      <div className="verify-code-modal">
        <div className="verify-code-header">
          <h2>Enter the verification code</h2>
          <button className="close" onClick={handleClose}>&times;</button>
        </div>
        <div className="verify-code-content">
          <form onSubmit={handleSubmit} className="verify-code-body">
            <div className="verify-code-input">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  maxLength="1"
                  onChange={(e) => handleCodeChange(e, index)}
                  required
                />
              ))}
            </div>
            <button type="submit" className="verify-code-button">
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodeModal;

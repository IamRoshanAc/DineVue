import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPasswordModal from './ForgotPasswordModal';
import VerifyCodeModal from './VerifyCodeModal';
import ResetPasswordModal from './ResetPasswordModal';

const ForgotPasswordFlow = () => {
  const [email, setEmail] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(true);
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleForgotPasswordSuccess = (email) => {
    setEmail(email);
    setShowForgotPasswordModal(false);
    setShowVerifyCodeModal(true);
  };

  const handleVerifyCodeSuccess = (code) => {
    setVerificationCode(code);
    setShowVerifyCodeModal(false);
    setShowResetPasswordModal(true);
  };

  const handleClose = () => {
    setShowForgotPasswordModal(false);
    setShowVerifyCodeModal(false);
    setShowResetPasswordModal(false);
  };

  return (
    <div>
      <ForgotPasswordModal
        show={showForgotPasswordModal}
        handleClose={handleClose}
        onSuccess={handleForgotPasswordSuccess}
      />
      <VerifyCodeModal
        show={showVerifyCodeModal}
        email={email}
        handleClose={handleClose}
        onSuccess={handleVerifyCodeSuccess}
      />
      <ResetPasswordModal
        show={showResetPasswordModal}
        email={email}
        code={verificationCode}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ForgotPasswordFlow;

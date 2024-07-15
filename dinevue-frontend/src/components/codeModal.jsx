import React, { useState } from 'react';
import { Button, Form, Modal, CloseButton } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../style/ForgetPasswordModal.css'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ForgetPasswordModal = ({ show, handleClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    

  
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
  

    const handleEmailSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/user/request-code', { email });
            toast.success(response.data.message);
            setStep(2);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleCodeSubmit = async () => {
        try {
            // Join the code array into a single string
            const codeString = code.join('');
            
            // Send the code to the server
            const response = await axios.post('http://localhost:5000/api/user/verify-code', { email, code: codeString });
            toast.success(response.data.message);
            setStep(3);
        } catch (error) {
            toast.error(error.response.data.message || 'An error occurred');
        }
    };
    
    const handlePasswordSubmit = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/user/verify-code-and-change-password', { email, code: code.join(''), newPassword });
            toast.success(response.data.message);
            handleClose();
        } catch (error) {
            // Ensure error.response is available before accessing its data
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
            toast.error(errorMessage);
        }
    };
    

    const handleCodeChange = (e, index) => {
        const newCode = [...code];
        newCode[index] = e.target.value;
        setCode(newCode);

        // Move to the next input box
        if (e.target.value.length === 1 && index < 5) {
            document.getElementById(`code-input-${index + 1}`).focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        if (paste.length === 6) {
            setCode(paste.split(''));
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Reset Password</h5>
                    <CloseButton onClick={handleClose} className="close-btn" />
                </div>
                <div className="modal-body">
                    {step === 1 && (
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Please enter your registered email address to reset the password</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    )}
                    {step === 2 && (
                        <Form>
                            <Form.Group controlId="formBasicCode">
                                <Form.Label>Please enter the 6 digit OTP sent to your email address</Form.Label>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }} onPaste={handlePaste}>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <Form.Control
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={code[index]}
                                            onChange={(e) => handleCodeChange(e, index)}
                                            style={{ width: '3rem', height: '3rem', textAlign: 'center', fontSize: '1.5rem', marginRight: '0.5rem' }}
                                            id={`code-input-${index}`}
                                            className="code-input"
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form>
                    )}
                    {step === 3 && (
                        <Form>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label>Enter Your New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Form.Group>
                            <br/>
                            <Form.Group controlId="formConfirmPassword">
                                
                                <Form.Control
                                    type="password"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    
                                />
                                
                                
                            </Form.Group>
                        </Form>
                    )}
                </div>
                <div className="modal-footer">
                    {step === 1 && (
                        <Button className="btn-orange" onClick={handleEmailSubmit}>
                            Continue
                        </Button>
                    )}
                    {step === 2 && (
                        <Button className="btn-orange" onClick={handleCodeSubmit}>
                            Continue
                        </Button>
                    )}
                    {step === 3 && (
                        <Button className="btn-orange" onClick={handlePasswordSubmit}>
                            Continue
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ForgetPasswordModal;
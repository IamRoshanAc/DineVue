import React, { useState } from 'react';
import '../style/ChangePassword.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { changePasswordApi } from '../apis/Api'; // Import changePasswordApi

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [passwordVisible, setPasswordVisible] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (field) => {
        setPasswordVisible((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    const handleChangePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
    
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const id = user.id; // Retrieve user ID from local storage
    
            if (typeof id !== 'number') {
                toast.error('Invalid user ID');
                return;
            }
    
            const response = await changePasswordApi(id, passwords.currentPassword, passwords.newPassword);
    
            if (response.data.success) {
                toast.success(response.data.message);
                // Clear input fields after successful password change (optional)
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                toast.error(response.data.message);
            }
    
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Error changing password');
        }
    };

    return (
        <>
            <form className="change-password-form">
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <div className="password-wrapper">
                        <input
                            type={passwordVisible.currentPassword ? "text" : "password"} 
                            placeholder="Current Password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handleInputChange}
                            required
                        />
                        <span className="toggle-password" onClick={() => togglePasswordVisibility('currentPassword')}>
                            <FontAwesomeIcon icon={passwordVisible.currentPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <div className="password-wrapper">
                        <input
                            type={passwordVisible.newPassword ? "text" : "password"} 
                            placeholder="New Password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleInputChange}
                            required
                        />
                        <span className="toggle-password" onClick={() => togglePasswordVisibility('newPassword')}>
                            <FontAwesomeIcon icon={passwordVisible.newPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password:</label>
                    <div className="password-wrapper">
                        <input
                            type={passwordVisible.confirmPassword ? "text" : "password"} 
                            placeholder="Confirm New Password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                        <span className="toggle-password" onClick={() => togglePasswordVisibility('confirmPassword')}>
                            <FontAwesomeIcon icon={passwordVisible.confirmPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>
                <button type="button" className="change-password-button" onClick={handleChangePassword}>
                    Change Password
                </button>
            </form>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </>
    );
};

export default ChangePassword;

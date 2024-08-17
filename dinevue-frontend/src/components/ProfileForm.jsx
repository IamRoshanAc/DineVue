import React, { useState, useEffect } from 'react';
import { getUserById, updateUserApi, deleteUserApi } from '../apis/Api'; // Import API functions
import '../style/Profile.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileForm = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        isAdmin: false,
    });

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user')); // Get stored user data
                if (!storedUser || !storedUser.id) {
                    console.error('User data not found in localStorage');
                    return;
                }

                const response = await getUserById(storedUser.id); // Fetch user data from backend
                setUser(response.data); // Assuming getUserById returns { data: { ...user } }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleUpdateUser = async () => {
        try {
            const response = await updateUserApi(user.id, user); // Assuming updateUserApi takes userId and updated user data
            console.log('User updated:', response);
            toast.success('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Error updating user');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await deleteUserApi(user.id); // Assuming deleteUserApi takes userId
            console.log('User deleted');
            toast.success('User deleted successfully');
            localStorage.clear(); // Clear local storage if needed
            navigate('/login');// Optionally, navigate to login or home page
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error deleting user');
        } finally {
            setShowDeleteDialog(false); // Close dialog after operation
        }
    };

    const handleConfirmDelete = () => {
        handleDeleteUser();
    };

    const handleCancelDelete = () => {
        setShowDeleteDialog(false); // Close dialog
    };

    return (
        <div className="profile-form-inside-container">
            <form className="profile-form">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="button" className="save-changes" onClick={handleUpdateUser}>
                    Save Changes
                </button>
                <button type="button" className="delete-account" onClick={() => setShowDeleteDialog(true)}>
                    Delete Account
                </button>
            </form>
            {showDeleteDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <p>Are you sure you want to delete your account?</p>
                        <button onClick={handleConfirmDelete}>Yes</button>
                        <button onClick={handleCancelDelete}>No</button>
                    </div>
                </div>
            )}
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default ProfileForm;

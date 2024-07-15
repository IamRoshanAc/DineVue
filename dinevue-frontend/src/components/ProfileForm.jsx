import React, { useState, useEffect } from 'react';
import { getUserById, updateUserApi, deleteUserApi } from '../apis/Api'; // Import API functions
import '../style/Profile.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileForm = () => {
    const [user, setUser] = useState({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        isAdmin: false,
    });

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
            // Optionally, you can show a success message or update the UI
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Error updating user');
            // Handle error: show error message or log
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await deleteUserApi(user.id); // Assuming deleteUserApi takes userId
            console.log('User deleted:', response);
            toast.success('User deleted successfully');
            // Optionally, you can navigate to a different page or show a success message
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error deleting user');
            // Handle error: show error message or log
        }
    };

    return (
        <form className="profile-form">
            <div className="input-group">
                <input
                    type="text"
                    defaultValue={user.firstName}
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
            <button type="button" className="delete-account" onClick={handleDeleteUser}>
                Delete Account
            </button>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </form>
    );
};

export default ProfileForm;

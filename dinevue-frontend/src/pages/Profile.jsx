import React, { useState, useEffect } from 'react';
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import ProfileForm from "../components/ProfileForm";
import DiningHistory from "../components/DiningHistory"; // Import DiningHistory
import '../style/Profile.css';
import { CgProfile } from "react-icons/cg";
import UpcomingReservations from '../components/UpcomingReservations';
import Noscrollnav from '../components/noscroll';
import ChangePassword from '../components/ChangePassword';

const Profile = () => {
    const [activeItem, setActiveItem] = useState('Profile');
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        // Retrieve firstName from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setFirstName(userData.firstName || ''); // Set default value if firstName is not available
        }
    }, []);

    const handleSidebarClick = (item) => {
        setActiveItem(item);
    };

    const renderContent = () => {
        switch (activeItem) {
            case 'Profile':
                return <ProfileForm />;
            case 'Dining History':
                return <DiningHistory />;
            case 'Reservations':
                return <UpcomingReservations />;
            case 'Change Password':
                return <ChangePassword />;
            // Add cases for other items if needed
            default:
                return <ProfileForm />;
        }
    };

    return (
        <>
            <Noscrollnav/>
            <div className="profile-container">
                <div className="profile-header">
                    <div>
                        <div className="profile-picture">
                            <CgProfile />
                        </div>
                        <h2 className="profile-text">Hi,{firstName || 'User'}</h2>
                    </div>
                </div>
                <div className="profile-content">
                    <div className="profile-sidebar">
                        <ul>
                            {['Profile', 'Change Password', 'Dining History', 'Reservations',].map(item => (
                                <li
                                    key={item}
                                    className={activeItem === item ? 'active' : ''}
                                    onClick={() => handleSidebarClick(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="profile-form-container">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile;

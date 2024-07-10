import React, { useState } from 'react';
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import '../style/Profile.css';
import { CgProfile } from "react-icons/cg";

const Profile = () => {
    const [activeItem, setActiveItem] = useState('Profile');

    const handleSidebarClick = (item) => {
        setActiveItem(item);
    };

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <div>
                        <div className="profile-picture">
                            <CgProfile />
                        </div>
                        <h2 className="profile-text">Hi, Roshan</h2>
                    </div>
                </div>
                <div className="profile-content">
                    <div className="profile-sidebar">
                        <ul>
                            {['Profile', 'Change Password', 'Dining History', 'Reservations', 'Saved Restaurants'].map(item => (
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
                        <form className="profile-form">
                            <div className="input-group">
                                <input type="text" placeholder="First Name" />
                                <input type="text" placeholder="Last Name" />
                            </div>
                            <div>
                                <input type="email" placeholder="Email" />
                            </div>
                            <div>
                                <input type="tel" placeholder="Phone Number" />
                            </div>
                            <button type="submit" className="save-changes">Save Changes</button>
                            <button type="button" className="delete-account">Delete Account</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile;

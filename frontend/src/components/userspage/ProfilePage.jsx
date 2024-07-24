import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';
import "./ProfilePage.css";

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.ourUsers);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return ( <center>
        <div className="profile-page-container">
            <br></br>
            <h2>Profile Information</h2>
            <p>Name: {profileInfo.name}</p>
            <p>Email: {profileInfo.email}</p>
            <p>City: {profileInfo.city}</p>
            <br></br> 
            {profileInfo.role === "ADMIN" && (
                <button className='update'><Link className='update-link'to={`/update-user/${profileInfo.id}`}>Update This Profile</Link></button>
            )} <br></br> <br></br>
         </div></center>
    );
}

export default ProfilePage;

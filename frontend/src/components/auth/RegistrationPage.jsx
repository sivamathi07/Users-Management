
import React, { useState } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

function RegistrationPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        city: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the register method from UserService

            const token = localStorage.getItem('token');
            await UserService.register(formData, token);

            // Clear the form fields after successful registration
            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
                city: ''
            });
            alert('User registered successfully');
            navigate('/admin/user-management');

        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred while registering user');
        }
    };

    return (
        <div className="auth-container-reg">
            <center><h2>Registration</h2></center>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your name" required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter your password"  required />
                </div>
                <div className="form-group">
                    <label>Role:</label>
                    <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="Enter your role" required />
                </div>
                <div className="form-group">
                    <label>City:</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter your city" required />
                </div> <center>
                <button type="submit">Register</button> </center>
            </form>
        </div>
    );
}

export default RegistrationPage;

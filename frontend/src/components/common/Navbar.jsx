import React from 'react';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';
import './Navbar.css';

function Navbar() {
    const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();

    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UserService.logout();
        }
    };

    return (
        <div className='nav'>
        <nav>
            <ul className='nav-list'>
    
                {isAuthenticated && <li className='nav-item'><Link className='nav-link' to="/profile">Profile</Link></li>} &nbsp; &nbsp;
                {isAdmin && <li className='nav-item'><Link className='nav-link' to="/admin/user-management">User Management</Link></li>} &nbsp; &nbsp;
        
                {isAuthenticated && <li className='nav-item'><Link className='nav-link' to="/employeetask">Employee Task</Link></li>} &nbsp; &nbsp;
                {isAuthenticated && <li className='nav-item'><Link className='nav-link' to="/" onClick={handleLogout}>Logout</Link></li>}
            </ul>
        </nav>
        </div>
    );
}

export default Navbar;

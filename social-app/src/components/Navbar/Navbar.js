import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css'; // Estilos específicos para la navbar (opcional)

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/posts">Social App</Link>
            </div>
            <ul className="navbar-links">
                {isAuthenticated ? (
                    <>
                        <li><Link to="/posts">Posts</Link></li>
                        <li><Link to="/create-post">Create Post</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;


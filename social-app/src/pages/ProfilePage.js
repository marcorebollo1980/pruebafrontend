import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/userService';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { isAuthenticated, user, token, loading: authLoading, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!isAuthenticated || !user || !token) {
                // Si no está autenticado, redirigir al login
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                const userProfile = await getUserProfile(user.id, token); // Asume que user.id existe
                setProfile(userProfile);
                setError('');
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError('Failed to load profile. Please try again.');
                // Podría redirigir a login si el token es inválido
                if (err.response && err.response.status === 401) {
                    logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) { // Esperar a que el contexto de autenticación termine de cargar
            fetchProfile();
        }
    }, [isAuthenticated, user, token, authLoading, navigate, logout]);

    if (loading || authLoading) {
        return <div className="loading-message">Loading profile...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!profile) {
        return <div className="no-profile-message">No profile data found.</div>;
    }

    return (
        <div className="profile-page">
            <h2>User Profile</h2>
            <div className="profile-details">
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Alias:</strong> {profile.alias}</p>
                <p><strong>First Name:</strong> {profile.firstName}</p>
                <p><strong>Last Name:</strong> {profile.lastName}</p>
                <p><strong>Date of Birth:</strong> {profile.dateOfBirth}</p>
                <p><strong>User ID:</strong> {profile.id}</p>
            </div>
        </div>
    );
};

export default ProfilePage;


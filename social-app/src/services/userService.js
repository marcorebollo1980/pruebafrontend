import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

export const getUserProfile = async (userId, token) => {
    try {
        if (!userId) {
            throw new Error('User ID is required for fetching profile.');
        }

        const response = await axios.get(`${API_BASE_URL}/users/${userId}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error.response?.data || error.message);
        throw error;
    }
};



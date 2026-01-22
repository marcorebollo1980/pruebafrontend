import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const getAllPosts = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/posts`, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error fetching all posts:', error.response?.data || error.message);
        throw error;
    }
};

export const createPost = async (message, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/posts`, { message }, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error.response?.data || error.message);
        throw error;
    }
};

export const likePost = async (postId, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/posts/${postId}/like`, {}, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error liking post:', error.response?.data || error.message);
        throw error;
    }
};

export const unlikePost = async (postId, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/posts/${postId}/like`, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error unliking post:', error.response?.data || error.message);
        throw error;
    }
};


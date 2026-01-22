import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createPost } from '../services/postService';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!isAuthenticated || !token) {
            setError('You must be logged in to create a post.');
            navigate('/login');
            return;
        }
        if (!message.trim()) {
            setError('Post message cannot be empty.');
            return;
        }

        try {
            setLoading(true);
            await createPost(message, token);
            setMessage('');
            navigate('/posts'); // Redirigir a la página de publicaciones
        } catch (err) {
            console.error("Error creating post:", err);
            setError('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-page">
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        required
                        disabled={loading}
                    ></textarea>
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;


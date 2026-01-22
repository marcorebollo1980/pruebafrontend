import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllPosts } from '../services/postService';
import PostCard from '../components/PostCard/PostCard'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom';

const PostsPage = () => {
    const { token, isAuthenticated, loading: authLoading, user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchPosts = useCallback(async () => {
        if (!isAuthenticated || !token) {
            // Si no está autenticado, redirigir al login
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            setError('');
            const data = await getAllPosts(token);
            // El backend no devuelve `likedByCurrentUser`, así que lo simulamos aquí o lo obtenemos de otra manera.
            // Para una implementación real, el backend debería indicar si el usuario actual ya dio like.
            const postsWithLikeStatus = data.map(p => ({
                ...p,
                likedByCurrentUser: false // Simulamos que no hay likes del usuario por defecto
                                          // Esto necesita ser real si el backend lo proporciona
            }));
            setPosts(postsWithLikeStatus);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            setError('Failed to load posts. Please try again.');
            if (err.response && err.response.status === 401) {
                // Si el token es inválido, forzar logout
                // logout(); // Esto podría ser llamado desde AuthContext
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, token, navigate]);

    useEffect(() => {
        if (!authLoading) { // Esperar a que el contexto de autenticación termine de cargar
            fetchPosts();
        }
    }, [fetchPosts, authLoading]);

    const handleLikeToggle = useCallback((postId) => {
        setPosts(prevPosts =>
            prevPosts.map(p => {
                if (p.id === postId) {
                    const newLikesCount = p.likedByCurrentUser ? p.likesCount - 1 : p.likesCount + 1;
                    return {
                        ...p,
                        likesCount: newLikesCount,
                        likedByCurrentUser: !p.likedByCurrentUser // Toggle localmente el estado del like
                    };
                }
                return p;
            })
        );
    }, []);

    if (loading || authLoading) {
        return <div className="loading-message">Loading posts...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (posts.length === 0) {
        return <div className="no-posts-message">No posts available.</div>;
    }

    return (
        <div className="posts-page">
            <h2>Publicaciones</h2>
            <div className="posts-list">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
                ))}
            </div>
        </div>
    );
};

export default PostsPage;


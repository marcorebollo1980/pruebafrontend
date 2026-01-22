import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { likePost, unlikePost } from '../../services/postService'; // Asegúrate de importar esto

// Necesitamos la carpeta components
// Necesitamos la carpeta PostCard dentro de components

const PostCard = ({ post, onLikeToggle }) => {
    const { token, user, isAuthenticated } = useAuth();
    const isLikedByUser = post.likedByCurrentUser; // Asume que el backend envía esta propiedad

    const handleLikeToggle = async () => {
        if (!isAuthenticated || !token) {
            alert('You must be logged in to like a post.');
            return;
        }
        try {
            if (isLikedByUser) {
                await unlikePost(post.id, token);
            } else {
                await likePost(post.id, token);
            }
            onLikeToggle(post.id); // Notifica al componente padre para actualizar la lista
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('Failed to toggle like. Please try again.');
        }
    };

    return (
        <div className="post-card">
            <p className="post-message">{post.message}</p>
            <p className="post-meta">
                Posted by User ID: {post.userId} on {format(new Date(post.publicationDate), 'MMM dd, yyyy HH:mm')}
            </p>
            <div className="post-actions">
                <span>Likes: {post.likesCount}</span>
                {isAuthenticated && (
                    <button onClick={handleLikeToggle} className={isLikedByUser ? 'liked' : ''}>
                        {isLikedByUser ? 'Unlike' : 'Like'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostCard;


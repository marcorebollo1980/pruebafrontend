import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PostsPage from './pages/PostsPage';
import CreatePostPage from './pages/CreatePostPage';
import Navbar from './components/Navbar/Navbar'; // Se implementará en la Tarea 14

import './App.css'; // Estilos globales

// Componente PrivateRoute para proteger rutas
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading-message">Loading authentication...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Navbar /> {/* Barra de navegación */}
                    <div className="content">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            {/* Ruta para el registro, si se implementa una página dedicada */}
                            {/* <Route path="/register" element={<RegisterPage />} /> */}

                            {/* Rutas Protegidas */}
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <ProfilePage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/posts"
                                element={
                                    <PrivateRoute>
                                        <PostsPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/create-post"
                                element={
                                    <PrivateRoute>
                                        <CreatePostPage />
                                    </PrivateRoute>
                                }
                            />
                            {/* Redirigir a posts si la ruta es / o cualquier otra no definida */}
                            <Route path="*" element={<Navigate to="/posts" />} />
                        </Routes>
                    </div>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;


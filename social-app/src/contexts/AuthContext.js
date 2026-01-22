import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser } from '../services/authService'; // Se implementará más tarde

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Al cargar la aplicación, intenta recuperar el token y el usuario del almacenamiento local
        const storedToken = localStorage.getItem('jwt_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Error parsing stored user data:", e);
                logout(); // Si hay un error, limpiar los datos corruptos
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await loginUser(username, password); // Llama al servicio de autenticación
            const newToken = response.token;
            // Aquí, en un caso real, decodificarías el token o harías otra llamada
            // para obtener los detalles completos del usuario.
            // Por simplicidad, asumimos que el username es suficiente por ahora.
            const tempUser = { username: username, id: response.userId || null }; // Si el backend devuelve userId
            
            setToken(newToken);
            setUser(tempUser);
            setIsAuthenticated(true);
            localStorage.setItem('jwt_token', newToken);
            localStorage.setItem('user', JSON.stringify(tempUser)); // Guarda el usuario como string
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            logout();
            throw error; // Propaga el error para que el componente de login lo maneje
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


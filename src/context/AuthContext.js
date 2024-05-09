import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga inicial

    const login = async (email, contrasenia) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, contrasenia })
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                setIsLoading(false);  // Establecer que la carga ha terminado
                return data;
            } else {
                throw new Error(data.message || 'Failed to login');
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setIsLoading(false);
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setIsLoading(false); // Establecer que la carga ha terminado después de verificar localStorage
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

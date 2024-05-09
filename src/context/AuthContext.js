import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (email, contrasenia) => {
        try {
            // Limpiar localStorage antes de cualquier operación de login
            localStorage.removeItem('user');

            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, contrasenia })
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                setIsLoading(false);
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
        localStorage.removeItem('userId');
        localStorage.removeItem('userRol');
        localStorage.removeItem('userName');
        localStorage.removeItem('user');
        setUser(null);
        setIsLoading(false);
    };


    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUser(parsedData);
            // Guardar en localStorage solo si es necesario
            if (localStorage.getItem('userId') !== parsedData.id) {
                localStorage.setItem('userId', parsedData.id);
            }
            if (localStorage.getItem('userRol') !== parsedData.rol) {
                localStorage.setItem('userRol', parsedData.rol);
            }
            if (localStorage.getItem('userName') !== parsedData.nombre_user) {
                localStorage.setItem('userName', parsedData.nombre_user);
            }
        }
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

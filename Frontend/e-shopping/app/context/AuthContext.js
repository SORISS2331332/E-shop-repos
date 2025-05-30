'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Erreur parsing user:', error);
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setLoading(false); 
    }, []);


    // Connexion
    const login = (userData, token) => {
        const userWithToken = { ...userData, token };
        localStorage.setItem('user', JSON.stringify(userWithToken));
        setUser(userWithToken);
    };
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser)); 
    };

    // Déconnexion
    const logout = () => {
        signOut();
        localStorage.removeItem('user');
        setUser(null);
        router.push('/'); 
    };


    return (
        <AuthContext.Provider
            value={{ user, login, logout, loading, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

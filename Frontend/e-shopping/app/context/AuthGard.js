'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import Loading from '../components/Loading';

const AuthGuard = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/connexion');
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                router.replace('/unauthorized');
            } else {
                setCheckingAuth(false); 
            }
        }
    }, [loading, user, allowedRoles, router]);

    if (loading || checkingAuth) {
        return <Loading />;
    }

    return children;
};

export default AuthGuard;

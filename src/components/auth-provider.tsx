
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext<{ user: User | null; loading: boolean; refetchUser: () => Promise<void> }>({ user: null, loading: true, refetchUser: async () => {} });

const AUTH_ROUTES = ['/auth/signin', '/auth/signup'];
const PUBLIC_ROUTES = [...AUTH_ROUTES]; // Add any other public routes here

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const auth = getAuth(firebaseApp);

    const refetchUser = useCallback(async () => {
        await auth.currentUser?.reload();
        const freshUser = auth.currentUser;
        setUser(freshUser);
    }, [auth]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (loading) return;

        const isAuthRoute = AUTH_ROUTES.includes(pathname);
        const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

        if (!user && !isPublicRoute) {
            router.push('/auth/signin');
        } else if (user && isAuthRoute) {
            router.push('/');
        }

    }, [user, loading, pathname, router]);


    if (loading || (!user && !PUBLIC_ROUTES.includes(pathname))) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, loading, refetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

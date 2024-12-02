import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { keycloakAuthUrl, keycloakClientSecret } from '@/constants/Api';
import { ReactNode } from 'react';

const AuthContext = createContext<{
    session: string | null;
    isGuest: boolean;
    isLoading: boolean;
    logIn: (username: string, password: string, remember: boolean) => void;
    logOut: () => void;
    logAsGuest: () => void;
}>({
    session: null as string | null,
    isGuest: false,
    isLoading: true,
    logIn: (username: string, password: string, remember: boolean) => null,
    logOut: () => null,
    logAsGuest: () => null,
});

export function useSession() {
    return useContext(AuthContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<string | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [remember, setRemember] = useState(false);

    // Charger la session à partir du stockage sécurisé au démarrage
    useEffect(() => {
        async function loadSession() {
            const storedSession = await SecureStore.getItemAsync('session');
            if (storedSession) {
                setSession(storedSession);
            }
            setIsLoading(false);
        }
        loadSession();
    }, []);

    // Nettoyer la session si "Se souvenir de moi" n'est pas activé
    useEffect(() => {
        const cleanupSession = async () => {
            if (!remember) {
                await SecureStore.deleteItemAsync('session');
            }
        };

        // Nettoyage lorsque le composant est démonté ou que l'application est fermée
        return () => {
            cleanupSession();
        };
    }, [remember]);

    const logIn = async (username: string, password: string, remember: boolean) => {
        const token = await authenticate(username, password);
        if (!token) {
            throw new Error('Invalid credentials');
        }

        setSession(token);
        setRemember(remember); // Mettre à jour l'état "Se souvenir de moi"
        setIsGuest(false);

        if (remember) {
            await SecureStore.setItemAsync('session', token);
        }
    };

    const logOut = async () => {
        setSession(null);
        setRemember(false); // Réinitialiser l'état "Se souvenir de moi"
        setIsGuest(false);
        await SecureStore.deleteItemAsync('session');
    };

    const logAsGuest = () => {
        setSession(null);
        setRemember(false); // Ne pas stocker la session en mode invité
        setIsGuest(true);
    };

    return (
        <AuthContext.Provider value={{ session, isGuest, isLoading, logIn, logOut, logAsGuest }}>
            {children}
        </AuthContext.Provider>
    );
}

const authenticate = async (username: string, password: string) => {
    const response = await axios.post(
        keycloakAuthUrl,
        {
            grant_type: 'password',
            client_id: 'booktime',
            client_secret: keycloakClientSecret,
            username: username,
            password: password,
            odience: 'gateway-client',
            scope: 'openid profile email'
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
    console.log(response);

    if (response.status === 200) {
        return response.data.access_token;
    }
    return null;
}

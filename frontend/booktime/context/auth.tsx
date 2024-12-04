import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { keycloakAuthUrl, keycloakClientSecret } from '@/constants/Api';
import { ReactNode } from 'react';
import { Session, sessionFromKeycloak, guestSession } from '@/models/session';
import { getSession, deleteSession, addSession } from '@/db/session';
import { useSQLiteContext } from 'expo-sqlite';

const AuthContext = createContext<{
    session: Session | null;
    isLoading: boolean;
    logIn: (username: string, password: string, remember: boolean) => void;
    logOut: () => void;
    logAsGuest: () => void;
}>({
    session: null as Session | null,
    isLoading: true,
    logIn: (username: string, password: string, remember: boolean) => null,
    logOut: () => null,
    logAsGuest: () => null,
});

export function useSession() {
    return useContext(AuthContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const db = useSQLiteContext();

    // Charger la session à partir du stockage sécurisé au démarrage
    useEffect(() => {
        async function loadSession() {
            const storedSession = await SecureStore.getItemAsync('session');
            if (storedSession) {
                const session = await getSession(db, storedSession);
                if (session) {
                    setSession(session);
                } else {
                    await SecureStore.deleteItemAsync('session');
                }
            }
            setIsLoading(false);
        }
        loadSession();
    }, []);

    const logIn = async (username: string, password: string, remember: boolean) => {
        const response = await authenticate(username, password);
        let session = sessionFromKeycloak(response);

        if (remember) {
            addSession(db, session);
            await SecureStore.setItemAsync('session', session.id);
        }

        setSession(session);
    };

    const logOut = async () => {
        if (session) {
            deleteSession(db, session);
            setSession(null);
            await SecureStore.deleteItemAsync('session');
        }
    };

    const logAsGuest = async () => {
        const session = guestSession();

        addSession(db, session);
        await SecureStore.setItemAsync('session', session.id);

        setSession(session);
    };

    return (
        <AuthContext.Provider value={{ session, isLoading, logIn, logOut, logAsGuest }}>
            {children}
        </AuthContext.Provider>
    );
}


const authenticate = async (username: string, password: string) => {
    // const response = await axios.post(
    //     keycloakAuthUrl,
    //     {
    //         data: {
    //             grant_type: 'password',
    //             client_id: 'booktime',
    //             client_secret: keycloakClientSecret,
    //             username: username,
    //             password: password,
    //             odience: 'gateway-client',
    //             scope: 'openid profile email'
    //         },
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //     }
    // );

    const response = await fetch(keycloakAuthUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: {
            client_id: 'booktime',
            client_secret: keycloakClientSecret,
            grant_type: 'password',
            username,
            password,
            scope: 'openid profile email',
            odience: 'gateway-client'
        }
    });


    console.log(response);

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    return response.data;
}

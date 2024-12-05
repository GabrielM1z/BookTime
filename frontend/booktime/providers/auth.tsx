import { keycloakAuthUrl, keycloakClientId, keycloakClientSecret } from "@/constants/Api";
import { usePersistentState } from "@/hooks/usePersistantState";
import { AuthResponseProps } from "@/models/keycloak";
import { Session } from "@/models/session";
import axios from 'axios';
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRepository } from "./repository";

export interface AuthContextProps {
    session: Session | null;
    sessions: Session[];
    isLoading: boolean;
    logIn: (username: string, password: string, remember: boolean) => void;
    logAsGuest: () => void;
    logOut: () => void;
    refreshSession: () => void;
    switchSession(session: Session): void;
}

const AuthContext = createContext<AuthContextProps>({
    session: null as Session | null,
    sessions: [],
    isLoading: true,
    logIn: (username: string, password: string, remember: boolean) => null,
    logAsGuest: () => null,
    logOut: () => null,
    refreshSession: () => null,
    switchSession: (session: Session) => null,
})

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = usePersistentState<Session | null>('@session', null);
    const [sessions, setSessions] = usePersistentState<Session[]>('@sessions', []);
    // const [sessionId, setSessionId] = usePersistentState<string | null>('@sessionId', null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // console.log(sessionId);
    console.log(sessions);

    const { userRepository } = useRepository();

    const logIn = async (username: string, password: string, remember: boolean) => {
        const authResponse = await authenticate(username, password);
        const session = Session.fromKeycloak(authResponse);
        const user = userRepository.getFromKeycloakToken(authResponse);
        session.idUser = user.id;
        setSession(session);
        if (remember) {
            // setSessionId(session.id);
            setSessions([...sessions, session]);
        }
    }

    const logAsGuest = async () => {
        const session = Session.guestSession();
        setSession(session);
        // setSessionId(session.id);
        setSessions([...sessions, session]);
    }

    const logOut = async () => {
        if (session) {
            setSession(null);
            // setSessionId(null);
            setSessions(sessions.filter(s => s.id !== session.id));
        }
    }

    const refreshSession = async () => {

    }

    const switchSession = (session: Session) => {        setSessions([]);

        setSession(session);
        // setSessionId(session.id);
    }

    useEffect(() => {
        // setSession(sessions.find(s => s.id === sessionId) || null);
        // console.log("session : ", session);
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{
            session,
            sessions,
            isLoading,
            logIn,
            logAsGuest,
            logOut,
            refreshSession,
            switchSession
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const authenticate = async (username: string, password: string): Promise<AuthResponseProps> => {
    const response = await axios.post(
        keycloakAuthUrl,
        new URLSearchParams({
            grant_type: 'password',
            client_id: keycloakClientId,
            client_secret: keycloakClientSecret,
            username: username,
            password: password,
            audience: 'gateway-client',
            scope: 'openid profile email'
        }).toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    console.log(response);

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    return response.data;
}

const refresh = async (refreshToken: string): Promise<AuthResponseProps> => {
    const response = await axios.post(
        keycloakAuthUrl,
        new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: keycloakClientId,
            client_secret: keycloakClientSecret,
            refresh_token: refreshToken,
            audience: 'gateway-client',
            scope: 'openid profile email'
        }).toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    return response.data;
}

import { usePersistentState } from "@/hooks/usePersistantState";
import { useRepository } from "@/hooks/useRepository";
import { Session } from "@/models/session";
import { authenticate } from "@/services/api";
import React, { createContext, useEffect, useState } from "react";

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

export const AuthContext = createContext<AuthContextProps>({
    session: null as Session | null,
    sessions: [],
    isLoading: true,
    logIn: (username: string, password: string, remember: boolean) => null,
    logAsGuest: () => null,
    logOut: () => null,
    refreshSession: () => null,
    switchSession: (session: Session) => null,
})

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

    const switchSession = (session: Session) => {
        setSessions([]);

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

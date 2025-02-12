import { useController } from "@/hooks/useController";
import { Session } from "@/models/Session";
import { AuthResponseProps } from "@/models/keycloak";
import { authenticate } from "@/services/api";
import React, { createContext, useEffect, useState } from "react";

export interface AuthContextProps {
    session: Session | null;
    isLoading: boolean;
    logIn: (username: string, password: string, remember: boolean) => Promise<void>;
    logAsGuest: () => Promise<void>;
    logOut: () => Promise<void>;
    updateSessionTokens: (authResponse: AuthResponseProps) => Promise<void>;
    switchSession: (session: Session) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { sessionController } = useController();

    const logIn = async (username: string, password: string, remember: boolean) => {
        try {
            setIsLoading(true);
            const authResponse = await authenticate(username, password);
            const newSession = await sessionController.getSessionFromAuthResponse(authResponse, remember);
            setSession(newSession);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }

    };

    const logAsGuest = async () => {
        try {
            setIsLoading(true);
            const guestSession = await sessionController.getOrCreateGuestSession();
            setSession(guestSession);
        }
        finally {
            setIsLoading(false);
        }
    };

    const logOut = async () => {
        if (session) {
            await sessionController.removeSession(session);
            setSession(null);
        }
    };

    const updateSessionTokens = async (authResponse: AuthResponseProps) => {
        if (session) {
            const updatedSession = await sessionController.updateSessionTokens(authResponse, session);
            setSession(updatedSession);
        }
    };

    const switchSession = (newSession: Session) => {
        setSession(newSession);
        sessionController.sessionRepo.setCurrentSessionId(newSession.id);
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const currentSession = await sessionController.getCurrentSession();
            setSession(currentSession);
            setIsLoading(false);
        })();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                session,
                isLoading,
                logIn,
                logAsGuest,
                logOut,
                updateSessionTokens,
                switchSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

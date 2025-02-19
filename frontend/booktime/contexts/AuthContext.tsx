import { useController } from "@/hooks/useController";
import { Session } from "@/models/Session";
import { AuthResponseProps } from "@/models/keycloak";
import { authenticate } from "@/services/axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionController } from "../controllers/SessionController";

export interface AuthContextProps {
    session: Session | null;
    sessions: Session[];
    isLoading: boolean;
    logIn: (username: string, password: string, remember: boolean) => Promise<void>;
    logAsGuest: () => Promise<void>;
    logOut: () => Promise<void>;
    updateSessionTokens: (authResponse: AuthResponseProps) => Promise<void>;
    switchSession: (session: Session) => void;
    sessionController: SessionController;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const sessionController = new SessionController();
    const { userController } = useController();

    const logIn = async (username: string, password: string, remember: boolean) => {
        try {
            setIsLoading(true);
            const authResponse = await authenticate(username, password);
            const newSession = await sessionController.getSessionFromAuthResponse(authResponse, remember);
            setSession(newSession);
            await userController.addFromSession(newSession);
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
            await userController.addFromSession(guestSession);
        }
        finally {
            setIsLoading(false);
        }
    };

    const logOut = async () => {
        if (session) {
            await sessionController.removeSession(session);
            await userController.local.delete(session.id_user);
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

    useEffect(() => {
        (async () => {
            const sessions = await sessionController.getAllSessions();
            setSessions(sessions);
        })();
    }, [session]);

    return (
        <AuthContext.Provider
            value={{
                session,
                sessions,
                isLoading,
                logIn,
                logAsGuest,
                logOut,
                updateSessionTokens,
                switchSession,
                sessionController,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export const useAuthContext = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

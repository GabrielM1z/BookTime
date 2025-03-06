import { SessionController } from "@/controllers/SessionController";
import { Session } from "@/models/Session";
import { AuthRegisterProps, AuthResponseProps } from "@/models/keycloak";
import { authenticate, logout as logoutAxios, register as registerAxios } from "@/services/axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthContextProps {
    session: Session | null;
    sessions: Session[];
    isLoading: boolean;
    register: (email: string, password: string, username: string) => Promise<void>;
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

    const register = async (email: string, password: string, username: string) => {
        try {
            setIsLoading(true);
            await registerAxios(email, password, username, username);
        } finally {
            setIsLoading(false);
        }
    };

    const logIn = async (email: string, password: string, remember: boolean) => {
        try {
            setIsLoading(true);
            const authResponse = await authenticate(email, password);
            const newSession = await sessionController.getSessionFromAuthResponse(authResponse, remember);
            setSession(newSession);
        } finally {
            setIsLoading(false);
        }

    };

    const logAsGuest = async () => {
        try {
            setIsLoading(true);
            const guestSession = await sessionController.getOrCreateGuestSession();
            setSession(guestSession);
        } finally {
            setIsLoading(false);
        }
    };

    const logOut = async () => {
        if (session) {
            try {
                setIsLoading(true);
                if (!SessionController.isGuest(session)) {
                    await logoutAxios(session.refresh_token!);
                }
                await sessionController.removeSession(session);
                setSession(null);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const updateSessionTokens = async (authResponse: AuthResponseProps) => {
        if (session) {
            const updatedSession = await sessionController.updateSessionTokens(authResponse, session);
            setSession(updatedSession);
        }
    };

    const switchSession = (newSession: Session) => {
        sessionController.sessionRepo.setCurrentSessionId(newSession.id);
        setSession(newSession);
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
                register,
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

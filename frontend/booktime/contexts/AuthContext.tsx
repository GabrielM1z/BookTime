import { useController } from "@/hooks/useController";
import { Session } from "@/models/Session";
import { AuthResponseProps } from "@/models/keycloak";
import { authenticate, logout as logoutAxios, register as registerAxios } from "@/services/axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionController } from "@/controllers/SessionController";
import { useFadeTransition } from "./FadeTransitionContext";


export interface AuthRegisterProps {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
}


export interface AuthContextProps {
    session: Session | null;
    sessions: Session[];
    isLoading: boolean;
    register: (props: AuthRegisterProps) => Promise<void>;
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
    const { withFadeTransition } = useFadeTransition();

    const register = async (props: AuthRegisterProps) => {
        // await registerAxios(props);
    };

    const logIn = async (username: string, password: string, remember: boolean) => {
        try {
            setIsLoading(true);
            const authResponse = await authenticate(username, password);
            const newSession = await sessionController.getSessionFromAuthResponse(authResponse, remember);
            await userController.addFromSession(newSession);
            withFadeTransition(() => setSession(newSession));
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
            await userController.addFromSession(guestSession);
            withFadeTransition(() => setSession(guestSession));
        }
        finally {
            setIsLoading(false);
        }
    };

    const logOut = async () => {
        if (session) {
            if (!SessionController.isGuest(session)) {
                await logoutAxios(session.refresh_token!);
            }
            await sessionController.removeSession(session);
            await userController.local.delete(session.id_user);
            withFadeTransition(() => setSession(null));
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
        withFadeTransition(() => setSession(newSession));
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

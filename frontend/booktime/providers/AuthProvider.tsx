import { sessionFromKeycloak, guestSessionFactory } from "@/helpers/keycloak";
import { Session } from "@/models/Session";
import { AuthResponseProps } from "@/models/keycloak";
import { authenticate } from "@/services/api";
import React, { createContext, useEffect, useState } from "react";
import { sessionControllerFactory } from "@/controllers/sessionController";
import { useController } from "@/hooks/useController";

export interface AuthContextProps {
    session: Session | null;
    isLoading: boolean;
    logIn: (username: string, password: string, remember: boolean) => Promise<void>;
    logAsGuest: () => Promise<void>;
    logOut: () => Promise<void>;
    updateSessionTokens: (authResponse: AuthResponseProps) => Promise<void>;
    switchSession: (session: Session) => void;
    getAllSessions: () => Promise<Session[]>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const sessionController = sessionControllerFactory();
    const { userController } = useController();

    const logIn = async (username: string, password: string, remember: boolean) => {
        try {
            setIsLoading(true);
            const authResponse = await authenticate(username, password);
            const newSession = sessionFromKeycloak(authResponse);
            if (remember) {
                await sessionController.save(newSession);
                await sessionController.setCurrentSessionId(newSession.id);
            }
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
            let guestSession = await sessionController.getGuestSession();
            if (!guestSession) {
                guestSession = guestSessionFactory();
                await sessionController.save(guestSession);
            }
            setSession(guestSession);
            await sessionController.setCurrentSessionId(guestSession.id);
        }
        finally {
            setIsLoading(false);
        }
    };

    const logOut = async () => {
        console.log('logOut');
        if (session) {
            await sessionController.delete(session.id);
            setSession(null);
            await sessionController.setCurrentSessionId(null);
        }
    };

    const updateSessionTokens = async (authResponse: AuthResponseProps) => {
        if (session) {
            const updatedSession = new Session({
                ...session,
                access_token: authResponse.access_token,
                expires_in: authResponse.expires_in,
                refresh_token: authResponse.refresh_token,
                refresh_expires_in: authResponse.refresh_expires_in,
                token_type: authResponse.token_type,
            });

            setSession(updatedSession);
            await sessionController.save(updatedSession);
        }
    };

    const switchSession = (newSession: Session) => {
        setSession(newSession);
        sessionController.setCurrentSessionId(newSession.id);
    };

    const getAllSessions = async () => {
        return await sessionController.getAll();
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const currentSessionId = await sessionController.getCurrentSessionId();
            if (currentSessionId) {
                const currentSession = await sessionController.getById(currentSessionId);
                setSession(currentSession);
            }
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
                getAllSessions,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

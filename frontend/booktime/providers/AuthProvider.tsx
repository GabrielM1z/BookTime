import { useRepository } from "@/hooks/useRepository";
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
    getAllSessions: () => Promise<Session[]>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { sessionRepository } = useRepository();

    const logIn = async (username: string, password: string, remember: boolean) => {
        try {
            setIsLoading(true);
            const authResponse = await authenticate(username, password);
            const newSession = Session.fromKeycloak(authResponse);
            if (remember) {
                await sessionRepository.save(newSession);
                await sessionRepository.setCurrentSessionId(newSession.id);
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
        let guestSession = await sessionRepository.getGuestSession();
        if (!guestSession) {
            guestSession = Session.guestSession();
            await sessionRepository.save(guestSession);
        }
        setSession(guestSession);
        await sessionRepository.setCurrentSessionId(guestSession.id);
    };

    const logOut = async () => {
        if (session) {
            await sessionRepository.delete(session.id);
            setSession(null);
            await sessionRepository.setCurrentSessionId(null);
        }
    };

    const updateSessionTokens = async (authResponse: AuthResponseProps) => {
        if (session) {
            const updatedSession = new Session({
                ...session,
                accessToken: authResponse.access_token,
                expiresIn: authResponse.expires_in,
                refreshToken: authResponse.refresh_token,
                refreshExpiresIn: authResponse.refresh_expires_in,
                tokenType: authResponse.token_type,
            });

            setSession(updatedSession);
            await sessionRepository.save(updatedSession);
        }
    };

    const switchSession = (newSession: Session) => {
        setSession(newSession);
        sessionRepository.setCurrentSessionId(newSession.id);
    };

    const getAllSessions = async () => {
        return await sessionRepository.getAll();
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const currentSessionId = await sessionRepository.getCurrentSessionId();
            if (currentSessionId) {
                const currentSession = await sessionRepository.getById(currentSessionId);
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
};
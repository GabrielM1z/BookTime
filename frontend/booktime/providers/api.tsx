import { useAuth } from '@/hooks/useAuth';
import { Api, api } from '@/services/api';
import { AxiosError } from 'axios';
import React, { createContext, useEffect } from 'react';

export const ApiContext = createContext<Api | undefined>(undefined);

export interface ApiProviderProps {
    children: React.ReactNode;
    onError?: (error: AxiosError) => void;
}

export function ApiProvider({
    children,
    onError,
}: ApiProviderProps) {
    const { session } = useAuth();

    useEffect(() => {
        // Ajoutez un intercepteur à la première fois
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                if (session && session.accessToken) {
                    config.headers['Authorization'] = `Bearer ${session.accessToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Ajoutez un intercepteur pour gérer les erreurs
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                onError && onError(error); // Gestion des erreurs
                return Promise.reject(error); // Propagation de l'erreur
            }
        );

        // Lorsque la session change, mettez à jour le token
        if (session && session.accessToken) {
            api.defaults.headers['Authorization'] = `${session.tokenType} ${session.accessToken}`;
        } else {
            delete api.defaults.headers['Authorization'];
        }

        // Nettoyage des intercepteurs
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [session]);

    return (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    )
}

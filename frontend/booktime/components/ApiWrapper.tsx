import { useAuth } from '@/hooks/useAuth';
import api, { refresh } from '@/services/api';
import axios from 'axios';
import { Href, useRouter } from 'expo-router';
import { Alert } from 'react-native';


export interface ApiWrapperProps {
    children: React.ReactNode;
}

export function ApiWrapper({ children }: ApiWrapperProps) {
    const { session, updateSessionTokens } = useAuth();

    api.interceptors.request.use(
        (config) => {
            console.debug('Request', config);
            if (session && session.access_token) {
                config.headers.Authorization = `${session.token_type || 'Bearer'} ${session.access_token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add a response interceptor
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (session && session.refresh_token) {
                const originalRequest = error.config;

                // If the error status is 401 and there is no originalRequest._retry flag,
                // it means the token has expired and we need to refresh it
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {

                        const response = await refresh(session?.refresh_token!);
                        await updateSessionTokens(response);

                        // Retry the original request with the new token
                        // originalRequest.headers.Authorization = `${session?.token_type || 'Bearer'} ${session?.access_token}`;
                        return axios(originalRequest);
                    } catch (error) {
                        const router = useRouter();
                        router.push('/signIn' as Href<'signIn'>);
                        return;
                    }
                }
            }

            if (error.response.status === 404) {
                const router = useRouter();
                Alert.alert(
                    "Erreur Internet",
                    "Impossible de charger la ressource.",
                    [{ text: "OK", onPress: () => router.back() }] // Retour à l'écran précédent
                );
                return;
            }

            console.error(error);
            return Promise.reject(error);
        }
    );
    return (
        children
    )
}
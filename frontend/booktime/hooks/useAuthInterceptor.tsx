import { useAuthContext } from "@/contexts/AuthContext";
import { api, refresh } from "@/services/axios";
import axios from "axios";
import { Href, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";


export const useAuthInterceptor = () => {
    const { session, updateSessionTokens } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                if (session && session.access_token && !config.headers['Authorization']) {
                    config.headers['Authorization'] = `${session.token_type || 'Bearer'} ${session.access_token}`;
                    console.debug('Add token to request', config);
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = api.interceptors.response.use(
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
                            originalRequest.headers.Authorization = `${session?.token_type || 'Bearer'} ${session?.access_token}`;
                            return axios(originalRequest)
                        } catch (error) {
                            router.push('/SignIn' as Href);
                            return;
                        }
                    }

                }

                // TODO: move this to a global error handler
                if (error.response.status === 404) {
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
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        }
    }, [session, router]);
}
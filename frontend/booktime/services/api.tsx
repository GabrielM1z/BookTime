import { keycloakAuthUrl, keycloakClientId, keycloakClientSecret, baseURL } from '@/constants/Api';
import { AuthResponseProps } from '@/models/keycloak';
import axios, { AxiosInstance } from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

export type Api = AxiosInstance;

const api = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api;

export interface ApiWrapperProps {
    children: React.ReactNode;
}

export function ApiWrapper({ children }: ApiWrapperProps) {
    const { session, updateSessionTokens } = useAuth();

    api.interceptors.request.use(
        (config) => {
            if (session && session.accessToken) {
                config.headers.Authorization = `${session.tokenType || 'Bearer'} ${session.accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add a response interceptor
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (session && session.refreshToken) {
                const originalRequest = error.config;

                // If the error status is 401 and there is no originalRequest._retry flag,
                // it means the token has expired and we need to refresh it
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {

                        const response = await refresh(session?.refreshToken!);
                        await updateSessionTokens(response);

                        // Retry the original request with the new token
                        originalRequest.headers.Authorization = `${session?.tokenType || 'Bearer'} ${session?.accessToken}`;
                        return axios(originalRequest);
                    } catch (error) {
                        const router = useRouter();
                        router.push('/sign-in');
                        return;
                    }
                }
            }

            return Promise.reject(error);
        }
    );
    return (
        children
    )
}

export const authenticate = async (username: string, password: string): Promise<AuthResponseProps> => {
    const response = await api.post(
        keycloakAuthUrl,
        new URLSearchParams({
            grant_type: 'password',
            client_id: keycloakClientId,
            client_secret: "xIkFqIPnNTBKO9p5OUz0hiyjSThgfo1t",
            username: username,
            password: password,
            audience: 'gateway-client',
            scope: 'openid profile email'
        }).toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    return response.data;
}

export const refresh = async (refreshToken: string): Promise<AuthResponseProps> => {
    const response = await api.post(
        keycloakAuthUrl,
        new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: keycloakClientId,
            client_secret: keycloakClientSecret,
            refresh_token: refreshToken,
            audience: 'gateway-client',
            scope: 'openid profile email'
        }).toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    return response.data;
}

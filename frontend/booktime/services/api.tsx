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
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZU3lfdTZ5OGtRRmp0Q0pseVcyblJuRVV5QXZCNER6eHhNT19iSG9PbElvIn0.eyJleHAiOjE3MzM3NTk1MzcsImlhdCI6MTczMzc1NTkzNywianRpIjoiYzcyYjU1NWQtZDJmOS00MmFhLWEzODUtMGNlNDU1ZDEyNzJkIiwiaXNzIjoiaHR0cDovLzE1OS4zMS4yNDcuMTMwOjgwODAvcmVhbG1zL2Jvb2t0aW1lIiwiYXVkIjpbImdhdGV3YXktY2xpZW50IiwiYWNjb3VudCJdLCJzdWIiOiIzMDBjZTcxNy05MDAwLTQyMWItODZkNi1iOGEzNzhlYmNmODgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJnYXRld2F5LWNsaWVudCIsInNpZCI6IjQ1MmMxODhhLTU0YWItNDZmYi1hOTBlLWQyODljZmY1OGVhYSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtYm9va3RpbWUiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJ0ZXN0IHRlc3QiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0ZXN0IiwiZ2l2ZW5fbmFtZSI6InRlc3QiLCJmYW1pbHlfbmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAdGVzdCJ9.IDUlp_Yr5E_Yta_ZKibKF_LInqm1V6RV_jx304ae1aKQZBxCPQqik6zH4DOV9j2nXMIwqT_USvtMbJOU-R1aN-NSSa50G417qGdunIrWyfDYn45PPhsUg4G2e4GjlhfH3cYhSHB15OjQprQPVxtHpkpI0m918ESM22lOMg_se9l4H6vx-0aU2SiyhQP3APysC9wxQEzqdMbMQ6C0HpCOGQVGUA6bQ2OSM_jFBFuXEJ22UYOLrF7X0pos-a8NAkFRe9YPgsaTvvTVQda7F9lclU2GNkhUHn93rgvOJuJFi0KDc7uPNi_aVIY4Wee7BFs6qmd5YURv3oP0ywNlsaokUQ'
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
            client_secret: keycloakClientSecret,
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

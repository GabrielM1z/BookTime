import { keycloakAuthUrl, keycloakClientId, keycloakClientSecret, keycloakBaseUrl, apiBaseUrl } from '@/constants/Api';
import { AuthResponseProps } from '@/models/keycloak';
import axios, { AxiosInstance } from 'axios';

export type Api = AxiosInstance;

const api = axios.create({
    baseURL: apiBaseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
})

export const keycloak = axios.create({
    baseURL: keycloakBaseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
})


export default api;

export const authenticate = async (username: string, password: string): Promise<AuthResponseProps> => {
    if (!keycloakClientId || !keycloakClientSecret) {
        throw new Error('Keycloak not configured');
    }
    
    const response = await keycloak.post(
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
    );

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    return response.data;
}

export const refresh = async (refreshToken: string): Promise<AuthResponseProps> => {
    if (!keycloakClientId || !keycloakClientSecret) {
        throw new Error('Keycloak not configured');
    }

    const response = await keycloak.post(
        keycloakAuthUrl,
        new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: keycloakClientId,
            client_secret: keycloakClientSecret,
            refresh_token: refreshToken,
            audience: 'gateway-client',
            scope: 'openid profile email'
        }).toString(),
    );

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    return response.data;
}

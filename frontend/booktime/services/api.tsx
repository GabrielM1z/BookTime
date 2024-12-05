import { keycloakAuthUrl, keycloakClientId, keycloakClientSecret, baseURL } from '@/constants/Api';
import { AuthResponseProps } from '@/models/keycloak';
import axios, { AxiosInstance } from 'axios';

export type Api = AxiosInstance;

export const api = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

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

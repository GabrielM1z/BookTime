import {
    apiBaseUrl,
    baseURL,
    keycloakAdminClientId,
    keycloakAdminClientSecret,
    keycloakAdminUrl,
    keycloakBaseUrl,
    keycloakClientId,
    keycloakClientSecret,
    keycloakRealmUrl,
} from '@/constants/Api';
import { AuthResponseProps } from '@/models/keycloak';
import axios, { AxiosInstance } from 'axios';
import { Alert } from 'react-native';

export type Api = AxiosInstance;

export const api = axios.create({
    baseURL: apiBaseUrl,
    timeout: 5000,
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
    },
})

export const keycloak = axios.create({
    baseURL: keycloakBaseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
})

export const checkServerAliveOrWarning = async () => {
    await axios.head(baseURL).catch(() => {
        Alert.alert(
            "Serveur non disponible",
            "Le serveur n'est pas disponible. Veuillez vérifier votre connexion internet.",
            [{ "text": "OK" }]
        )
    })
}

export const authenticate = async (email: string, password: string): Promise<AuthResponseProps> => {
    const response = await keycloak.post(
        keycloakRealmUrl + "/protocol/openid-connect/token",
        new URLSearchParams({
            grant_type: 'password',
            client_id: keycloakClientId,
            client_secret: keycloakClientSecret,
            username: email,
            password: password,
            audience: 'gateway-client',
            // scope: 'openid profile email'
        }).toString(),
    );

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    return response.data;
}

export const refresh = async (refreshToken: string): Promise<AuthResponseProps> => {
    const response = await keycloak.post(
        keycloakRealmUrl + "/protocol/openid-connect/token",
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

export const logout = async (refreshToken: string): Promise<void> => {
    await keycloak.post(
        keycloakRealmUrl + "/protocol/openid-connect/logout",
        new URLSearchParams({
            client_id: keycloakClientId,
            client_secret: keycloakClientSecret,
            refresh_token: refreshToken,
        }).toString(),
    );
}

export const register = async (email: string, password: string, firstName: string, lastName: string): Promise<void> => {
    const response = await keycloak.post(
        keycloakRealmUrl + "/protocol/openid-connect/token",
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: keycloakAdminClientId,
            client_secret: keycloakAdminClientSecret,
        }).toString(),
    );

    console.log(response);

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    const adminToken = response.data.access_token;
    const tokenType = response.data.token_type;

    await keycloak.post(
        keycloakAdminUrl + "/users",
        {
            email: email,
            firstName: firstName,
            lastName: lastName,
            enabled: true,
            credentials: [{ type: 'password', value: password, temporary: false }],
        },
        {
            headers: {
                'Authorization': `${tokenType} ${adminToken}`,
                'content-type': 'application/json',
            }
        }
    );
}

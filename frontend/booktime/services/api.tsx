import { keycloakAuthUrl, keycloakClientId, keycloakClientSecret, baseURL } from '@/constants/Api';
import { AuthResponseProps } from '@/models/keycloak';
import axios, { AxiosInstance } from 'axios';

export type Api = AxiosInstance;

const api = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZU3lfdTZ5OGtRRmp0Q0pseVcyblJuRVV5QXZCNER6eHhNT19iSG9PbElvIn0.eyJleHAiOjE3Mzk3MDQzMzMsImlhdCI6MTczOTcwMDczMywianRpIjoiNjI5MGUxNzgtZTMwZC00MmNjLTgyOTgtOTRjNWM5NGY0MGRkIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrL3JlYWxtcy9ib29rdGltZSIsImF1ZCI6WyJnYXRld2F5LWNsaWVudCIsImFjY291bnQiXSwic3ViIjoiMzAwY2U3MTctOTAwMC00MjFiLTg2ZDYtYjhhMzc4ZWJjZjg4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZ2F0ZXdheS1jbGllbnQiLCJzaWQiOiI0NzFkMmRlYy05N2QwLTRjMzgtYjQ5OC0zYjA4MmZjMTQwZGQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWJvb2t0aW1lIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidGVzdCB0ZXN0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdCIsImdpdmVuX25hbWUiOiJ0ZXN0IiwiZmFtaWx5X25hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QifQ.JOqlg8Y4v4RzJAlgFgZMGfByAyYG8I8SiwVNfzEYvqSQSTfdu3-oz1CsWlyHFJU3Fe3a8rhNSXlL43DgQISW38sA1DIZMDUTL2qKPrkuUFEVP_vqeeziJmWPcughYUbE3A1oHn-P07Zjg8YyLCzbup808GlgtQXE7fXamF4tmZKMZSOoYJFly-Z9oCdhWhko_R23B90QgZ3ruhCBnqed6UcvSZmR1GI7JVB2OWvysM4-v5t0tgK1C_yq_3Rosyin4dYtTlKcBGRYlnu0VAkD5Ok5qmYM1sdjenwLcMoXe52MjOowLZDiL44NpLSgbXfPhYCYVvzTPaajfdM71R4URQ'
    },
})


export default api;

export const authenticate = async (username: string, password: string): Promise<AuthResponseProps> => {
    if (!keycloakClientId || !keycloakClientSecret) {
        throw new Error('Keycloak not configured');
    }
    
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
    );

    if (response.status !== 200) {
        throw new Error('Invalid credentials');
    }

    return response.data;
}

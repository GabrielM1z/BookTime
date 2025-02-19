export const keycloakClientSecret = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET;
export const keycloakClientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || "gateway-client";

export const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://159.31.247.130";
export const keycloakBaseUrl = baseURL + ":8080";
export const apiBaseUrl = baseURL + ":8082";
export const keycloakAuthUrl = keycloakBaseUrl + "/realms/booktime/protocol/openid-connect/token";

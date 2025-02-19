export const keycloakClientSecret = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET;
export const keycloakClientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || "gateway-client";

export const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://159.31.247.130";

export const keycloakAuthUrl = baseURL +  ":8080/realms/booktime/protocol/openid-connect/token";

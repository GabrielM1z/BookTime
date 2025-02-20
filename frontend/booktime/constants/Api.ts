export const keycloakClientSecret = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET!;
export const keycloakClientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || "gateway-client";
export const keycloakAdminClientId = process.env.EXPO_PUBLIC_KEYCLOAK_ADMIN_CLIENT_ID || "admin-cli";
export const keycloakAdminClientSecret = process.env.EXPO_PUBLIC_KEYCLOAK_ADMIN_CLIENT_SECRET!;

export const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://159.31.247.130";
export const keycloakBaseUrl = baseURL + ":8080";
export const apiBaseUrl = baseURL + ":8082";
export const keycloakRealmUrl = keycloakBaseUrl + "/realms/booktime";
export const keycloakAdminUrl = keycloakBaseUrl + "/admin/realms/booktime";

if (!keycloakClientId || !keycloakClientSecret || !keycloakAdminClientId || !keycloakAdminClientSecret) {
    throw new Error('Keycloak not configured');
}

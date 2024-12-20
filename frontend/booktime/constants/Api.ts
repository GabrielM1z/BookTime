const key = "key=AIzaSyA_vH7yqR2lJkLlgUmXt2Ydpw53X8tMYys"
export const apiLink = "https://www.googleapis.com/books/v1/volumes?" + key;

// export const backendIp = "159.31.247.130";
// export const keycloakAuthUrl = "http://" + backendIp + ":8080/realms/booktime/protocol/openid-connect/token";
// export const apiLinkServeur = "http://159.31.247.130:8082/books/search/?";

export const keycloakClientSecret = process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET;
export const keycloakClientId = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "gateway-client";

// export const baseURL = process.env.REACT_APP_BACKEND_URL || "http://159.31.247.130:8082";
export const baseURL = process.env.REACT_APP_BACKEND_URL || "http://booktime.ddns.net";


export const keycloakAuthUrl = baseURL +  "/auth/realms/booktime/protocol/openid-connect/token";
export const apiLinkServeur = baseURL + "/api/books/search/?";

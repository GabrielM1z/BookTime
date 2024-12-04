import { jwtDecode } from 'jwt-decode';

export interface User {
    id: string;
    emailVerified: boolean;
    username: string;
    givenName: string;
    familyName: string
    email: string;
}

interface DecodedPayload {
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
}


export const userFromKeycloakToken = (token : any) : User => {
    const decoded = jwtDecode<DecodedPayload>(token);

    return {
        id: decoded.sub,
        emailVerified: decoded.email_verified,
        username: decoded.preferred_username,
        givenName: decoded.given_name,
        familyName: decoded.family_name,
        email: decoded.email
    }
}

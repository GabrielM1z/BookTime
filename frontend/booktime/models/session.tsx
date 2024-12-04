import { User, userFromKeycloakToken, } from './user';
import { randomUUID } from 'expo-crypto';

export interface Session {
    id: string;
    user?: User | null;
    isGuest: boolean;
    accessToken?: string;
    expiresIn?: number;
    refreshToken?: string;
    refreshExpiresIn?: number;
    tokenType?: string;
    sessionState?: string;
}

export const sessionFromKeycloak = (data: any): Session => {
    return {
        id: randomUUID(),
        user: userFromKeycloakToken(data.access_token),
        isGuest: false,
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
        refreshExpiresIn: data.refresh_expires_in,
        tokenType: data.token_type,
        sessionState: data.session_state
    }
}

export const guestSession = (): Session => {
    return {
        id: randomUUID(),
        isGuest: true
    }
}

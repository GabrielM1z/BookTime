import { jwtDecode } from 'jwt-decode';
import { PayloadProps, AuthResponseProps } from '@/models/keycloak';
import { User } from '@/models/User';
import { Session } from '@/models/Session';
import { randomUUID } from 'expo-crypto';
import { guestUserId } from '@/constants';


export const userFromToken = (token: string): User => {
    const payload = jwtDecode<PayloadProps>(token);
    return {
        id_user: payload.sub,
        email_verified: payload.email_verified,
        username: payload.preferred_username,
        given_name: payload.given_name,
        family_name: payload.family_name,
        email: payload.email
    };
}

export const sessionFromKeycloak = (data: AuthResponseProps): Session => {
    return new Session({
        id: randomUUID(),
        id_user: userFromToken(data.access_token).id_user,
        access_token: data.access_token,
        expires_in: data.expires_in,
        refresh_token: data.refresh_token,
        refresh_expires_in: data.refresh_expires_in,
        token_type: data.token_type,
    });
}

export const guestSessionFactory = (): Session => {
    return new Session({
        id: randomUUID(),
        id_user: guestUserId,
    });
}

export const guestUserFactory = (): User => {
    return {
        id_user: guestUserId,
    }
}

import { randomUUID } from 'expo-crypto';
import { AuthResponseProps } from './keycloak';
import { Serializable } from './serializable';

export interface SessionProps {
    id: string;
    idUser?: string;
    isGuest: boolean;
    accessToken?: string;
    expiresIn?: number;
    refreshToken?: string;
    refreshExpiresIn?: number;
    tokenType?: string;

    serialize?: () => string;
    deserialize?: (data: string) => Session;
    fromKeycloak?: (data: any) => Session;
    guestSession?: () => Session;
}

export class Session extends Serializable<Session> implements SessionProps {
    id: string;
    idUser?: string;
    isGuest: boolean;
    accessToken?: string;
    expiresIn?: number;
    refreshToken?: string;
    refreshExpiresIn?: number;
    tokenType?: string;

    constructor(data: SessionProps) {
        super();
        this.id = data.id;
        this.idUser = data.idUser;
        this.isGuest = data.isGuest;
        this.accessToken = data.accessToken;
        this.expiresIn = data.expiresIn;
        this.refreshToken = data.refreshToken;
        this.refreshExpiresIn = data.refreshExpiresIn;
        this.tokenType = data.tokenType;
    }

    toJSON(): object {
        return {
            id: this.id,
            id_user: this.idUser,
            is_guest: this.isGuest,
            access_token: this.accessToken,
            expires_in: this.expiresIn,
            refresh_token: this.refreshToken,
            refresh_expires_in: this.refreshExpiresIn,
            token_type: this.tokenType,
        };
    }

    fromJSON(json: any): void {
        this.id = json.id;
        this.idUser = json.id_user;
        this.isGuest = json.is_guest;
        this.accessToken = json.access_token;
        this.expiresIn = json.expires_in;
        this.refreshToken = json.refresh_token;
        this.refreshExpiresIn = json.refresh_expires_in;
        this.tokenType = json.token_type;
    }

    static fromKeycloak(data: AuthResponseProps): Session {
        return new Session({
            id: randomUUID(),
            idUser: undefined,
            isGuest: false,
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            refreshExpiresIn: data.refresh_expires_in,
            tokenType: data.token_type,
        });
    }

    static guestSession(): Session {
        return new Session({
            id: randomUUID(),
            isGuest: true,
        });
    }

}

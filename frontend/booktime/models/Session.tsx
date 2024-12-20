import { Serializable } from './serializable';
import { guestUserId } from '@/constants';

export interface SessionProps {
    id: string;
    id_user: string;
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_expires_in?: number;
    token_type?: string;
}

export class Session extends Serializable<SessionProps> implements SessionProps {
    id: string;
    id_user: string;
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_expires_in?: number;
    token_type?: string;

    constructor(data: SessionProps) {
        super();
        this.id = data.id;
        this.id_user = data.id_user;
        this.access_token = data.access_token;
        this.expires_in = data.expires_in;
        this.refresh_token = data.refresh_token;
        this.refresh_expires_in = data.refresh_expires_in;
        this.token_type = data.token_type;
    }

    toString(): string {
        return "<Session id=" + this.id + " id_user=" + this.id_user + ">";
    }

    toJSON(): any {
        return {
            id: this.id,
            id_user: this.id_user,
            access_token: this.access_token,
            expires_in: this.expires_in,
            refresh_token: this.refresh_token,
            refresh_expires_in: this.refresh_expires_in,
            token_type: this.token_type,
        };
    }

    static fromJSON(json: any): Session {
        return new Session({
            id: json.id,
            id_user: json.id_user,
            access_token: json.access_token,
            expires_in: json.expires_in,
            refresh_token: json.refresh_token,
            refresh_expires_in: json.refresh_expires_in,
            token_type: json.token_type,
        });
    }

    isGuest(): boolean {
        return this.id_user === guestUserId;
    }
}

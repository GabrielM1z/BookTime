import { Serializable } from './serializable';
import { jwtDecode } from 'jwt-decode';
import { PayloadProps } from './keycloak';

export interface UserProps {
    id: string;
    emailVerified: boolean;
    username: string;
    givenName: string;
    familyName: string
    email: string;
}

export class User extends Serializable<User> implements UserProps {
    id: string;
    emailVerified: boolean;
    username: string;
    givenName: string;
    familyName: string;
    email: string;

    guestId: string = 'guest';

    constructor(data: UserProps) {
        super();
        this.id = data.id;
        this.emailVerified = data.emailVerified;
        this.username = data.username;
        this.givenName = data.givenName;
        this.familyName = data.familyName;
        this.email = data.email;
    }

    toJSON(): object {
        return {
            id: this.id,
            email_verified: this.emailVerified,
            username: this.username,
            given_name: this.givenName,
            family_name: this.familyName,
            email: this.email
        };
    }

    fromJSON(json: any): void {
        this.id = json.id;
        this.emailVerified = json.email_verified;
        this.username = json.username;
        this.givenName = json.given_name;
        this.familyName = json.family_name;
        this.email = json.email;
    }

    static fromToken(token: string): User {
        const payload = jwtDecode<PayloadProps>(token);
        return new User({
            id: payload.sub,
            emailVerified: payload.email_verified,
            username: payload.preferred_username,
            givenName: payload.given_name,
            familyName: payload.family_name,
            email: payload.email
        });
    }
}

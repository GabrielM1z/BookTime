export interface PayloadProps {
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
}

export interface TokenProps {
    payload: PayloadProps;
    header: any;
}

export interface AuthResponseProps {
    access_token: string;
    refresh_token: string;
    id_token: string;
    token_type: string;
    expires_in: number;
    refresh_expires_in: number;
}

export interface AuthRegisterProps {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

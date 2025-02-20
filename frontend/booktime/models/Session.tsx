interface SessionProps {
    id_user: string;
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_expires_in?: number;
    token_type?: string;
}

export interface Session extends SessionProps {
    id: string;
}

export interface AddSessionDto extends SessionProps {

}

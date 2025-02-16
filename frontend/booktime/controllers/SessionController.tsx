import { guestUserId } from "@/constants";
import { useRepository } from "@/hooks/useRepository";
import { Session } from "@/models/Session";
import { AuthResponseProps, PayloadProps } from "@/models/keycloak";
import { CachedSessionRepository } from "@/repositories/SessionRepository";
import { jwtDecode } from 'jwt-decode';
import uuid from 'react-native-uuid';

export class SessionController {
    sessionRepo: CachedSessionRepository;

    constructor() {
        this.sessionRepo = new CachedSessionRepository();
    }

    async getSessionFromAuthResponse(authResponse: AuthResponseProps, save: boolean = false): Promise<Session> {
        const payload = jwtDecode<PayloadProps>(authResponse.access_token);
        const newSession: Session = {
            id: uuid.v4(),
            id_user: payload.sub,
            access_token: authResponse.access_token,
            expires_in: authResponse.expires_in,
            refresh_token: authResponse.refresh_token,
            refresh_expires_in: authResponse.refresh_expires_in,
            token_type: authResponse.token_type,
        }

        if (save) {
            await this.sessionRepo.addOrUpdate(newSession);
            await this.sessionRepo.setCurrentSessionId(newSession.id);
        }
        return newSession;
    }

    async removeSession(session_or_id: Session | string): Promise<void> {
        const id = typeof session_or_id === "string" ? session_or_id : session_or_id.id;
        await this.sessionRepo.delete(id);
        const currentSessionId = await this.sessionRepo.getCurrentSessionId();
        if (currentSessionId === id) {
            await this.sessionRepo.setCurrentSessionId(null);
        }
    }

    async getCurrentSession(): Promise<Session | null> {
        const currentSessionId = await this.sessionRepo.getCurrentSessionId();
        return currentSessionId ? await this.sessionRepo.get(currentSessionId) : null;
    }

    async updateSessionTokens(authResponse: AuthResponseProps, session: Session): Promise<Session> {
        const updatedSession: Session = {
            ...session,
            access_token: authResponse.access_token,
            expires_in: authResponse.expires_in,
            refresh_token: authResponse.refresh_token,
            refresh_expires_in: authResponse.refresh_expires_in,
            token_type: authResponse.token_type,
        }
        await this.sessionRepo.addOrUpdate(updatedSession);
        return updatedSession;
    }

    async getOrCreateGuestSession(): Promise<Session> {
        const sessions = await this.sessionRepo.getAll();
        let guestSession = sessions.find(s => s.id_user === guestUserId);
        if (guestSession === undefined) {
            guestSession = {
                id: uuid.v4(),
                id_user: guestUserId,
            }
            await this.sessionRepo.addOrUpdate(guestSession);
        }
        await this.sessionRepo.setCurrentSessionId(guestSession.id);
        return guestSession;
    }

    async getAllSessions(): Promise<Session[]> {
        return await this.sessionRepo.getAll();
    }

    static isGuest(session: Session): boolean {
        return session.id_user === guestUserId;
    }
}

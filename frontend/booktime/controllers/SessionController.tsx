import { Session, AddSessionDto } from "@/models/Session";
import { CachedSessionRepository } from "@/repositories/SessionRepository";
import { guestUserId } from "@/constants";
import { useRepository } from "@/hooks/useRepository";
import { AuthResponseProps, PayloadProps } from "@/models/keycloak";
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';

export class SessionController {
    private sessionRepo: CachedSessionRepository;

    constructor() {
        const { cachedSessionRepository } = useRepository();
        this.sessionRepo = cachedSessionRepository;
    }

    sessionFromAuthResponse(authResponse: AuthResponseProps): Session {
        const payload = jwtDecode<PayloadProps>(authResponse.access_token);
        const newSession: Session = {
            id: uuidv4(),
            id_user: payload.sub,
            access_token: authResponse.access_token,
            expires_in: authResponse.expires_in,
            refresh_token: authResponse.refresh_token,
            refresh_expires_in: authResponse.refresh_expires_in,
            token_type: authResponse.token_type,
        }
        return newSession;
    }

    async createSession(session: Session): Promise<void> {
        await this.sessionRepo.add(session);
        await this.sessionRepo.setCurrentSessionId(session.id);
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

    async updateSessionTokens(authResponse: AuthResponseProps): Promise<void> {
        
    }

    async getOrCreateGuestSession(): Promise<Session> {
        const sessions = await this.sessionRepo.getAll();
        const guestSession = sessions.find(s => s.id_user === guestUserId);
        if (guestSession) {
            await this.sessionRepo.setCurrentSessionId(guestSession.id);
            return guestSession;
        }
        const newSession: Session = {
            id: uuidv4(),
            id_user: guestUserId,
        }
        await this.createSession(newSession);
        return newSession;
    }
}

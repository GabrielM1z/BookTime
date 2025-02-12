import { Session, AddSessionDto } from "@/models/Session";
import { CachedSessionRepository } from "@/repositories/SessionRepository";
import { guestUserId } from "@/constants";
import { useRepository } from "@/hooks/useRepository";

export class SessionController {
    private sessionRepo: CachedSessionRepository;

    constructor() {
        this.sessionRepo = new CachedSessionRepository();
    }

    async createSession(newSession: AddSessionDto): Promise<Session> {
        const session = await this.sessionRepo.add(newSession);
        await this.sessionRepo.setCurrentSessionId(session.id);
        return session;
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

    async getOrCreateGuestSession(): Promise<Session> {
        const sessions = await this.sessionRepo.getAll();
        const guestSession = sessions.find(s => s.id_user === guestUserId);
        if (guestSession) {
            return guestSession;
        }
        const newSession: AddSessionDto = {
            id_user: guestUserId,
        }
        return await this.createSession(newSession);
    }
}

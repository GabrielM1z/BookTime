import { Session, AddSessionDto } from "@/models/Session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from 'uuid';

export interface SessionRepository {
    get(id: string): Promise<Session | null>;
    getAll(): Promise<Session[]>;
    add(sessionData: AddSessionDto): Promise<Session>;
    update(sessionData: Session): Promise<void>;
    delete(id_or_session: string | Session): Promise<void>;
}

export class CachedSessionRepository implements SessionRepository{
    private sessionsKey = "@sessions";
    private currentSessionKey = "@currentSessionId";

    async get(id: string): Promise<Session | null> {
        const sessions = await this.getAll();
        return sessions.find(s => s.id === id) || null;
    }

    async getAll(): Promise<Session[]> {
        const sessionsJson = await AsyncStorage.getItem(this.sessionsKey);
        return sessionsJson ? JSON.parse(sessionsJson) : [];
    }

    async add(session: AddSessionDto): Promise<Session> {
        const newSession: Session = {
            id: uuidv4(),
            ...session,
        }
        const sessions = await this.getAll();
        sessions.push(newSession);
        await AsyncStorage.setItem(this.sessionsKey, JSON.stringify(sessions));
        return newSession;
    }

    async update(session: Session): Promise<void> {
        const sessions = await this.getAll();
        const updatedSessions = sessions.map(s => s.id === session.id ? session : s);
        await AsyncStorage.setItem(this.sessionsKey, JSON.stringify(updatedSessions));
    }

    async delete(session_or_id: string | Session): Promise<void> {
        const id = typeof session_or_id === "string" ? session_or_id : session_or_id.id;
        const sessions = await this.getAll();
        const updatedSessions = sessions.filter(s => s.id !== id);
        await AsyncStorage.setItem(this.sessionsKey, JSON.stringify(updatedSessions));
    }

    async setCurrentSessionId(id: string | null): Promise<void> {
        if (id) {
            await AsyncStorage.setItem(this.currentSessionKey, id);
        } else {
            await AsyncStorage.removeItem(this.currentSessionKey);
        }
    }

    async getCurrentSessionId(): Promise<string | null> {
        return await AsyncStorage.getItem(this.currentSessionKey);
    }
}

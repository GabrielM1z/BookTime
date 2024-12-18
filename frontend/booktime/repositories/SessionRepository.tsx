import { Session } from "@/models/Session";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SessionRepository {
    getById(id: string): Promise<Session | null>;
    getAll(): Promise<Session[]>;
    save(session: Session): Promise<void>;
    delete(id: string): Promise<void>;
    setCurrentSessionId(id: string | null): Promise<void>;
    getCurrentSessionId(): Promise<string | null>;
    getGuestSession(): Promise<Session | null>;
}

export class CacheSessionRepository implements SessionRepository {
    private sessionsKey = "@sessions";
    private currentSessionKey = "@currentSessionId";

    /**
     * Sauvegarde ou met à jour une session dans la liste des sessions persistantes.
     */
    async save(session: Session): Promise<void> {
        const sessions = await this.getAll();
        const updatedSessions = sessions.filter(s => s.id !== session.id); // Retirer l'ancienne version
        updatedSessions.push(session);
        await AsyncStorage.setItem(this.sessionsKey, JSON.stringify(updatedSessions));
    }

    /**
     * Récupère une session par son ID.
     */
    async getById(id: string): Promise<Session | null> {
        const sessions = await this.getAll();
        const session = sessions.find(s => s.id === id);
        return session || null;
    }

    /**
     * Récupère toutes les sessions persistées.
     */
    async getAll(): Promise<Session[]> {
        const sessionsJson = await AsyncStorage.getItem(this.sessionsKey);
        return sessionsJson ? JSON.parse(sessionsJson) : [];
    }

    /**
     * Supprime une session par son ID.
     */
    async delete(id: string): Promise<void> {
        const sessions = await this.getAll();
        const updatedSessions = sessions.filter(s => s.id !== id);
        await AsyncStorage.setItem(this.sessionsKey, JSON.stringify(updatedSessions));
    }

    /**
     * Définit l'ID de la session courante.
     */
    async setCurrentSessionId(id: string | null): Promise<void> {
        if (id) {
            await AsyncStorage.setItem(this.currentSessionKey, id);
        } else {
            await AsyncStorage.removeItem(this.currentSessionKey);
        }
    }

    /**
     * Récupère l'ID de la session courante.
     */
    async getCurrentSessionId(): Promise<string | null> {
        return await AsyncStorage.getItem(this.currentSessionKey);
    }

    /**
     * Récupère une session invitée existante, ou null si aucune n'existe.
     */
    async getGuestSession(): Promise<Session | null> {
        const sessions = await this.getAll();
        return sessions.find(session => session.isGuest) || null;
    }
}

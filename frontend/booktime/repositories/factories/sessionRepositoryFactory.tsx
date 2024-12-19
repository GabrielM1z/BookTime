import { SessionRepository, CacheSessionRepository } from "../SessionRepository";

export const sessionRepositoryFactory = (): SessionRepository => {
    return new CacheSessionRepository();
}

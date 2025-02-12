import { CacheSessionRepository, SessionRepository } from "../SessionRepository";

export const sessionControllerFactory = (): SessionRepository => {
    return new CacheSessionRepository();
}

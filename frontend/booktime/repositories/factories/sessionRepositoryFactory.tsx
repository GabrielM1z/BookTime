import { SessionRepositoryProps, SessionRepository } from "../SessionRepository";

export const sessionRepositoryFactory = (): SessionRepositoryProps => {
    return new SessionRepository();
}

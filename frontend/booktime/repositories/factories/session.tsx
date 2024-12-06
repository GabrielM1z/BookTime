import { SessionRepositoryProps, SessionRepository } from "../session";

export const sessionRepositoryFactory = (): SessionRepositoryProps => {
    return new SessionRepository();
}

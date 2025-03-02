import { guestUserId } from "@/constants";
import { RepositoryProxy, proxyRepository } from "@/helpers/proxyRepository";
import { Session } from "@/models/Session";
import { User } from "@/models/User";
import { RemoteUserRepository, LocalUserRepository, UserRepository } from "@/repositories/UserRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import { SessionController } from "./SessionController";
import { SynchronisationController } from "./SynchronisationController";

export interface UserControllerProps {
    user: UserRepository;
    getBySession: (session: Session) => Promise<User>;
    addFromSession: (session: Session) => Promise<void>;
    getAll: () => Promise<User[]>;
    getAllBySession: (sessions: Session[]) => Promise<User[]>;
}

class UserController {
    static guestUser(): User {
        return {
            id_user: guestUserId,
        }
    }
}

export class LocalUserController extends UserController implements UserControllerProps {
    user: LocalUserRepository;
    sync: SynchronisationController;
    remote: RemoteUserController;

    constructor(db: SQLiteDatabase) {
        super();
        this.sync = new SynchronisationController("user", "user_action", db);
        this.user = new LocalUserRepository(db);
        this.remote = new RemoteUserController();
    }

    async getBySession(session: Session): Promise<User> {
        return (await this.user.get(session.id_user))!;
    }

    async addFromSession(session: Session): Promise<void> {
        let user = await this.user.get(session.id_user);
        if (!user) {
            user = SessionController.isGuest(session) ? UserController.guestUser() : await this.remote.user.getFromToken();
            // let assume that the user cant be null
            await this.user.add(user!);
        }
    }

    async getAll(): Promise<User[]> {
        return await this.user.getAll();
    }

    async getAllBySession(sessions: Session[]): Promise<User[]> {
        const users = await Promise.all(sessions.map(async (session) => await this.user.get(session.id_user)));
        return users.filter((user): user is User => user !== undefined);
    }
}


export class RemoteUserController extends UserController implements UserControllerProps {
    user: RemoteUserRepository;

    constructor() {
        super();
        this.user = new RemoteUserRepository();
    }

    async getBySession(session: Session): Promise<User> {
        return await this.user.getFromToken();
    }

    async addFromSession(session: Session): Promise<void> { }

    async getAll(): Promise<User[]> {
        return [await this.user.getFromToken()];
    }

    async getAllBySession(sessions: Session[]): Promise<User[]> {
        return [];
    } // TODO: implement
}
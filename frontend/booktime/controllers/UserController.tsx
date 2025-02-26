import { guestUserId } from "@/constants";
import { RepositoryProxy, proxyRepository } from "@/helpers/proxyRepository";
import { Session } from "@/models/Session";
import { User } from "@/models/User";
import { APIUserRepository, SQLiteUserRepository, UserRepository } from "@/repositories/UserRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import { SessionController } from "./SessionController";
import { SynchronisationController } from "./SynchronisationController";

export class UserController extends SynchronisationController {
    user: RepositoryProxy<UserRepository, APIUserRepository, SQLiteUserRepository>;

    constructor(db: SQLiteDatabase) {
        super("user", "user_action", db);
        this.user = proxyRepository(new SQLiteUserRepository(db), new APIUserRepository());
    }

    async getBySession(session: Session): Promise<User> {
        if (Platform.OS === "web") {
            return await this.user.remote.getFromToken();
        }
        return (await this.user.local.get(session.id_user))!;
    }

    async addFromSession(session: Session): Promise<void> {
        if (Platform.OS === "web") {
            return;
        }

        let user = await this.user.local.get(session.id_user);
        if (!user) {
            user = SessionController.isGuest(session) ? UserController.guestUser() : await this.user.remote.getFromToken();
            // let assume that the user cant be null
            await this.user.local.add(user!);
        }
    }

    async getAll(): Promise<User[]> {
        if (Platform.OS === "web") {
            return [await this.user.remote.getFromToken()];
        }
        return await this.user.local.getAll();
    }

    async getAllBySession(sessions: Session[]): Promise<User[]> {
        if (Platform.OS === "web") {
            return [] // TODO: implement
        }

        const users = await Promise.all(sessions.map(async (session) => await this.user.local.get(session.id_user)));
        return users.filter((user): user is User => user !== undefined);
    }

    static guestUser(): User {
        return {
            id_user: guestUserId,
        }
    }
}
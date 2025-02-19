import { Session } from "@/models/Session";
import { UserProps, User } from "@/models/User";
import { APIUserRepository, SQLiteUserRepository, UserRepository } from "@/repositories/UserRepository";
import { DualRepositoryController } from "./DualRepositoryController";
import { SessionController } from "./SessionController";
import { guestUserId } from "@/constants";


export class UserController extends DualRepositoryController<SQLiteUserRepository, APIUserRepository> {
    constructor() {
        super(new APIUserRepository(), new SQLiteUserRepository());
    }

    async getBySession(session: Session): Promise<User> {
        if (UserController.isWeb()) {
            return await this.remote.getFromToken();
        }
        return (await this.local.get(session.id_user))!;
    }

    async addFromSession(session: Session): Promise<void> {
        if (UserController.isWeb()) {
            return;
        }

        let user = await this.local.get(session.id_user);
        if (!user) {
            user = SessionController.isGuest(session) ? UserController.guestUser() : await this.remote.getFromToken();
            console.log(user);
            // let assume that the user cant be null
            await this.local.add(user!);
        }
    }

    async getAll(): Promise<User[]> {
        if (UserController.isWeb()) {
            return [await this.remote.getFromToken()];
        }
        return await this.local.getAll();
    }

    async getAllBySession(sessions: Session[]): Promise<User[]> {
        if (UserController.isWeb()) {
            return [] // TODO: implement
        }

        const users = await Promise.all(sessions.map(async (session) => await this.local.get(session.id_user)));
        return users.filter((user): user is User => user !== undefined);
    }

    static guestUser(): User {
        return {
            id_user: guestUserId,
        }
    }
}
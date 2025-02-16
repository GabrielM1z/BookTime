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
        console.log("UserController.getBySession");
        let user: User | null;
        if (UserController.isWeb()) {
            user = await this.remote.getFromToken();
        }
        else {
            console.log("not web");
            user = await this.local.get(session.id_user);
            console.log(user);
            if (!user) {
                user = SessionController.isGuest(session) ? UserController.guestUser() : await this.remote.get(session.id_user);
                console.log(user);
                // let assume that the user cant be null
                await this.local.add(user!);
            }
        }
        return user!;
    }

    static guestUser(): User {
        return {
            id_user: guestUserId,
        }
    }
}
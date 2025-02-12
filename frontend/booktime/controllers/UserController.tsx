import { AbstractController } from "@/controllers/AbstractController";
import { UserRepositoryProps } from "@/repositories/UserRepository";
import { useRepository } from "@/hooks/useRepository";
import { User, Session } from "@/models";
import { guestUserFactory, userFromToken } from "@/helpers/keycloak";


export class UserController extends AbstractController<UserRepositoryProps> {
    constructor() {
        const { apiUserRepository, sqliteUserRepository } = useRepository();
        super(apiUserRepository, sqliteUserRepository);
    }

    async addIfNotExists(session: Session): Promise<boolean | null> {
        if (AbstractController.isWeb()) {
            return null;
        }

        const user = await this.sqlite.getById(session.id_user);
        if (!user) {
            await this.sqlite.add(session.isGuest() ? guestUserFactory() : userFromToken(session.access_token));
            return true;
        }
    }
}
import { ActionRepository, SQLiteActionRepository } from "../ActionRepository";

export const actionRepositoryFactory = (): ActionRepository => {
    return new SQLiteActionRepository();
}

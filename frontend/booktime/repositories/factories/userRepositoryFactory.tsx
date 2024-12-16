import { UserRepositoryProps, SQLiteUserRepository, APIUserRepository } from "../UserRepository";
import { Platform } from "react-native";

export const userRepositoryFactory = (): UserRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APIUserRepository();
    }
    return new SQLiteUserRepository();
}

import { UserRepository, SQLiteUserRepository, APIUserRepository } from "../UserRepository";
import { Platform } from "react-native";

export const userRepositoryFactory = (): UserRepository => {
    if (Platform.OS === 'web') {
        return new APIUserRepository();
    }
    return new SQLiteUserRepository();
}

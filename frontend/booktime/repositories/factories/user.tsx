import { Platform } from "react-native";
import { UserRepositoryProps, APIUserRepository, SQLiteUserRepository } from "../user";

export const userRepositoryFactory = (): UserRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APIUserRepository();
    }
    return new SQLiteUserRepository();
}

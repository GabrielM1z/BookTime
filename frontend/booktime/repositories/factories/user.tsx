import { Platform } from "react-native";
import { APIUserRepository, SQLiteUserRepository, UserRepositoryProps } from "../user";

export const userRepositoryFactory = (): UserRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APIUserRepository();
    }
    return new SQLiteUserRepository();
}

import { Platform } from "react-native";
import { APIAuthorRepository, AuthorRepositoryProps, SQLiteAuthorRepository } from "../author";


export const authorRepositoryFactory = (): AuthorRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APIAuthorRepository();
    }
    return new SQLiteAuthorRepository();
}
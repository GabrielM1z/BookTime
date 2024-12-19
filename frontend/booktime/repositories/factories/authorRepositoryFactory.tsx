import { Platform } from "react-native";
import { APIAuthorRepository, AuthorRepository, SQLiteAuthorRepository } from "../AuthorRepository";


export const authorRepositoryFactory = (): AuthorRepository => {
    if (Platform.OS === 'web') {
        return new APIAuthorRepository();
    }
    return new SQLiteAuthorRepository();
}
import { Platform } from "react-native";
import { BookRepository, APIBookRepository, SQLiteBookRepository } from "../BookRepository";

export const bookRepositoryFactory = (): BookRepository => {
    if (Platform.OS === 'web') {
        return new APIBookRepository();
    }
    return new SQLiteBookRepository();
}
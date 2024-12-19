import { Platform } from "react-native";
import { APIGenreRepository, GenreRepository, SQLiteGenreRepository } from "../GenreRepository";


export const genreRepositoryFactory = (): GenreRepository => {
    if (Platform.OS === 'web') {
        return new APIGenreRepository();
    }
    return new SQLiteGenreRepository();
}
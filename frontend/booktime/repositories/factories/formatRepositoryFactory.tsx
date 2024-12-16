import { Platform } from "react-native";
import { APIFormatRepository, FormatRepositoryProps, SQLiteFormatRepository } from "../FormatRepository";


export const formatRepositoryFactory = (): FormatRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APIFormatRepository();
    }
    return new SQLiteFormatRepository();
}
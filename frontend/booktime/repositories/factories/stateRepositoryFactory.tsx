import { Platform } from "react-native";
import { APIStateRepository, SQLiteStateRepository, StateRepositoryProps } from "../StateRepository";


export const stateRepositoryFactory = (): StateRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APIStateRepository();
    }
    return new SQLiteStateRepository();
}
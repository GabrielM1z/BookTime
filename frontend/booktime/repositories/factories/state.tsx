import { Platform } from "react-native";
import { APIStateRepository, SQLiteStateRepository, StateRepositoryProps } from "../state";


export const stateRepositoryFactory = (): StateRepositoryProps => {
    if (Platform.OS === 'web') {
        return new APIStateRepository();
    }
    return new SQLiteStateRepository();
}
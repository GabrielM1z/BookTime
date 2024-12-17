import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";


export interface Action {
    id: string;
    id_user: string;
    table_name: string;
    date: Timestamp;
    type: string;
    action: JSON;
    executed_by: string;
}
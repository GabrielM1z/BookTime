import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";


export interface State{
    state : string;
    progression : number;
    read_count : number;
    last_read_date : string
    id_user : string;
    id_book : string;
    is_available : boolean;
}
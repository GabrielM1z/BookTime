import { ActionEncoded } from "@/models/Action";

export interface ResponseSync {
    actions_to_exec: ActionEncoded[];
    sync_date: string;
}

export interface BookResponseSync extends ResponseSync {
    require_books: string[];
}

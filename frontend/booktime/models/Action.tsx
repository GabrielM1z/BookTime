export interface Action {
    id_action: string;
    id_user: string;
    table_name: string;
    date: string;
    type: string;
    action: JSON;
    executed_by: string;
}

export interface ActionEncoded extends Omit<Action, "id_action" | "action"> {
    id_action?: string;
    action: string;
}

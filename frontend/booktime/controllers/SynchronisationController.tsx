import { SynchronisationProxy } from "./SynchronisationProxy";
import { SQLiteDatabase } from "expo-sqlite";
import { CrudRepositoryWithoutGet } from "@/types/repositories";

export interface SynchronisationControllerProps<T> {
    sync: SynchronisationProxy
    processActions: (data: T) => void;
    getRepositoryByTableName: (tableName: string) => any;
    getCudByActionName: (actionName: string) => any;
}

export abstract class SynchronisationController<T = any> implements SynchronisationControllerProps<T> {
    protected abstract tableToRepositoryMap: { [key: string]: string };
    abstract processActions(data: T): void;
    sync: SynchronisationProxy;
    [key: string]: any;

    actionToCudMap: { [key: string]: keyof CrudRepositoryWithoutGet<any> } = {
        "INSERT": "create",
        "UPDATE": "update",
        "DELETE": "delete"
    }

    constructor(service: string, tableName: string, db: SQLiteDatabase) {
        this.sync = new SynchronisationProxy(service, tableName, this, db);
    }

    getRepositoryByTableName(tableName: string): any {
        const propertyName = this.tableToRepositoryMap[tableName];
        return this[propertyName];
    }

    getCudByActionName(actionName: string): any {
        const propertyName = this.tableToRepositoryMap[actionName];
        return this[propertyName];
    }
}

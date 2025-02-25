import { SQLiteActionRepository } from "@/repositories/ActionRepository"
import { SQLiteDatabase } from "expo-sqlite";

export class SynchronisationController {
    local: SQLiteActionRepository;

    constructor(db: SQLiteDatabase) {
        this.local = new SQLiteActionRepository(db);
    }
}

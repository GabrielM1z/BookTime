import { SQLiteDatabase } from "expo-sqlite";

export class VariableRepository {
    db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    /**
     * Récupère la valeur d'une variable par son nom
     * @param name Le nom de la variable
     * @returns La valeur de la variable ou null si non trouvée
     */
    async get(name: string): Promise<string | null> {
        const result = await this.db.getFirstAsync<{ value: string }>(
            `SELECT value FROM variable WHERE name = ?;`,
            [name]
        );
        return result?.value ?? null;
    }

    /**
     * Insère ou met à jour une variable
     * @param name Le nom de la variable
     * @param value La valeur à insérer ou à mettre à jour
     */
    async set(name: string, value: string): Promise<void> {
        await this.db.runAsync(
            `INSERT OR REPLACE INTO variable (name, value) VALUES (?, ?);`,
            [name, value]
        );
    }
}

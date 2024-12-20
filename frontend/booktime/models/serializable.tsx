export abstract class Serializable<T> {
    abstract toJSON(): T;

    /**
     * Méthode statique pour créer une instance depuis JSON.
     * Doit être implémentée par les classes dérivées.
     */
    static fromJSON<U>(json: U): Serializable<U> {
        throw new Error("fromJSON must be implemented in derived classes");
    }

    /**
     * Sérialise un seul objet en JSON.
     */
    static serializeSingle<U, T extends Serializable<U>>(input: T): string {
        return JSON.stringify(input.toJSON());
    }

    /**
     * Sérialise une liste d'objets en JSON.
     */
    static serializeList<U, T extends Serializable<U>>(input: T[]): string {
        return JSON.stringify(input.map(item => item.toJSON()));
    }

    /**
     * Désérialise un JSON string en un seul objet.
     */
    static deserializeSingle<U, T extends Serializable<U>>(
        jsonString: string
    ): T {
        const jsonData = JSON.parse(jsonString);
        return (this as unknown as { fromJSON(json: U): T }).fromJSON(jsonData);
    }

    /**
     * Désérialise un JSON string en une liste d'objets.
     */
    static deserializeList<U, T extends Serializable<U>>(
        jsonString: string
    ): T[] {
        const jsonData = JSON.parse(jsonString);
        if (!Array.isArray(jsonData)) {
            throw new Error("Expected a JSON array.");
        }
        return jsonData.map(itemData =>
            (this as unknown as { fromJSON(json: U): T }).fromJSON(itemData)
        );
    }
}
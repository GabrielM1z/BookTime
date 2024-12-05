export abstract class Serializable<T> {
    /**
     * Sérialise l'objet en une chaîne JSON.
     */
    serialize(): string {
        return JSON.stringify(this.toJSON());
    }

    /**
     * Désérialise une chaîne JSON et retourne une instance de l'objet.
     * @param json Chaîne JSON à désérialiser.
     */
    static deserialize<U extends Serializable<U>>(this: new () => U, json: string): U {
        const instance = new this();
        instance.fromJSON(JSON.parse(json));
        return instance;
    }

    /**
     * Méthode à implémenter pour convertir l'objet en un format sérialisable.
     */
    abstract toJSON(): object;

    /**
     * Méthode à implémenter pour hydrater l'objet à partir d'un format JSON.
     */
    abstract fromJSON(json: any): void;
}
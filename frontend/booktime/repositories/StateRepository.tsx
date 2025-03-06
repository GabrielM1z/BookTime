import { SynchronisationController } from "@/controllers/SynchronisationController";
import { State } from "@/models/State";
import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import uuid from 'react-native-uuid';


export interface StateRepository {
    getAll: () => Promise<State[]>;
    getFromIdBook: (idBook: string) => Promise<State | null>;
    updateState: (state: State) => Promise<boolean>
}

export class LocalStateRepository implements StateRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async getLastInsertedId(): Promise<string> {
        const result = await this.db.getFirstAsync<State>(
            `SELECT * FROM state ORDER BY rowid DESC LIMIT 1;`,
        );

        return (result as State).id_book;
    }

    async getAll(): Promise<State[]> {
        let allRows = await this.db.getAllAsync<State>(
            'SELECT * FROM state'
        );
        return allRows;
    }

    async updateState(state: State): Promise<boolean> {

        try {
            // Création dynamique de la requête SQL
            console.log("state :", state);

            // Exécution de la requête
            // await this.db.runAsync(`UPDATE state 
            // SET state = $state, 
            //     progression = $progression, 
            //     read_count = $read_count, 
            //     last_read_date = $last_read_date, 
            //     is_available = $is_available
            // WHERE id_user = $id_user AND id_book = $id_book`, {
            //     $state: state.state,
            //     $progression: state.progression,
            //     $read_count: state.read_count,
            //     $last_read_date: state.last_read_date,
            //     $is_available: state.is_available,
            //     $id_user: state.id_user,
            //     $id_book: state.id_book
            // })

            await this.db.runAsync(`UPDATE state 
            SET progression = 12
            WHERE state.id_user = "guest" AND state.id_book = "9781264687749";`)

            console.log("updateState: Mise à jour réussie !");
            return true;
        } catch (error) {
            console.error("Erreur dans updateState :", error);
            return false;
        }
    }


    async getFromIdBook(idBook: string): Promise<State | null> {

        const result = await this.db.getFirstAsync<State>(
            'SELECT * FROM state WHERE id_book = $idBook AND id_user = $idUser',
            {
                $idBook: idBook,
                $idUser: this.id_user
            });

        return result;
    }

    async create(state: State): Promise<void> {
        try {
            await this.db.runAsync(
                `INSERT OR IGNORE INTO state (progression, id_user, id_book, read_count, state)
                 VALUES ($progression, $id_user, $id_book, $read_count, $state);`,
                {
                    $progression: 0,
                    $id_user: state.id_user,
                    $id_book: state.id_book,
                    $read_count: 0,
                    $state: ""
                }
            );

        } catch (error) {
            console.log("create :", error);

        }
    }
}


export class RemoteStateRepository implements StateRepository {
    async getAll(): Promise<State[]> {
        return [];
    }

    async getFromIdBook(idBook: string): Promise<State | null> {
        return null;
    }

    async updateState(state: State): Promise<boolean> {
        return false
    }

    async add(state: State): Promise<void> {
        return;
    }
}
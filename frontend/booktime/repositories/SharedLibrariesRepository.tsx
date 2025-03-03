import { SynchronisationController } from "@/controllers/SynchronisationController";
import { SharedLibrary } from "@/models/SharedLibrary";
import { SQLiteDatabase } from 'expo-sqlite';



export interface SharedLibraryRepository {
    create: (newSharedLibrary: SharedLibrary) => Promise<void>;
    createAll: (listNewSharedLibrary: SharedLibrary[]) => Promise<void>;

}

export class LocalSharedLibraryRepository implements SharedLibraryRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async create(newSharedLibrary: SharedLibrary) : Promise<void>{
        await this.db.runAsync(
            `INSERT OR IGNORE INTO shared_library (id_user, id_library) VALUES ($id_user, $id_library);`,
            {
                $id_user: newSharedLibrary.id_user,
                $id_library: newSharedLibrary.id_library,
            }
        )
    }

    async createAll(listNewSharedLibrary: SharedLibrary[]) : Promise<void>{

        const insertSharedLibrary = await this.db.prepareAsync(
            `INSERT OR IGNORE INTO shared_library (id_user, id_library) VALUES ($id_user, $id_library);`,
        );
        
        try {
            for (const newSharedLibrary of listNewSharedLibrary) {
    
                await insertSharedLibrary.executeAsync({
                    $id_user: newSharedLibrary.id_user,
                    $id_library: newSharedLibrary.id_library,
                });
            }
        }finally {
            await insertSharedLibrary.finalizeAsync();
        }
    }

}


export class RemoteSharedLibraryRepository implements SharedLibraryRepository {
    
    constructor() {
    }

    
    async create(newSharedLibrary: SharedLibrary): Promise<void> {
    }

    async createAll(listNewSharedLibrary: SharedLibrary[]): Promise<void> {

    }

}
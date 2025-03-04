import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { SharedLibrary, CreateSharedLibraryDto, DeleteSharedLibraryDto } from "@/models/SharedLibrary";
import { CrudJunctionRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';

export interface SharedLibraryRepository extends CrudJunctionRepository<SharedLibrary> {
    create: (sharedLibrary: CreateSharedLibraryDto) => Promise<void>;
    createAll: (sharedLibraries: CreateSharedLibraryDto[]) => Promise<void>;
    delete: (sharedLibrary: DeleteSharedLibraryDto) => Promise<void>;
}

export class LocalSharedLibraryRepository implements SharedLibraryRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async create(sharedLibrary: CreateSharedLibraryDto): Promise<void> {
        await this.db.runAsync(
            `INSERT OR IGNORE INTO shared_library (id_user, id_library) 
            VALUES ($id_user, $id_library);`,
            {
                $id_user: sharedLibrary.id_user,
                $id_library: sharedLibrary.id_library,
            }
        )
    }

    async createAll(sharedLibraries: CreateSharedLibraryDto[]): Promise<void> {
        const insertSharedLibrary = await this.db.prepareAsync(
            `INSERT OR IGNORE INTO shared_library (id_user, id_library) 
            VALUES ($id_user, $id_library);`,
        );

        try {
            sharedLibraries.forEach(async (sharedLibrary) => {
                await insertSharedLibrary.executeAsync({
                    $id_user: sharedLibrary.id_user,
                    $id_library: sharedLibrary.id_library,
                });
            });
        } finally {
            await insertSharedLibrary.finalizeAsync();
        }
    }

    async delete(sharedLibrary: DeleteSharedLibraryDto): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM shared_library 
            WHERE id_user == $id_user AND id_library == $id_library;`,
            {
                $id_user: sharedLibrary.id_user,
                $id_library: sharedLibrary.id_library,
            }
        )
    }
}

export class RemoteSharedLibraryRepository implements SharedLibraryRepository {
    async create(sharedLibrary: CreateSharedLibraryDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createAll(sharedLibraries: CreateSharedLibraryDto[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(sharedLibrary: DeleteSharedLibraryDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { CreateSharedLibraryDto, DeleteSharedLibraryDto, SharedLibrary } from "@/models/SharedLibrary";
import { Context, CrudRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';
import { BaseLocalRepository } from "./base/BaseRepository";
import { syncAfterMethod } from '@/decorators/synchronisation';

export interface SharedLibraryRepository extends CrudRepository<
    SharedLibrary, CreateSharedLibraryDto, SharedLibrary, DeleteSharedLibraryDto
> { }

export class LocalSharedLibraryRepository extends BaseLocalRepository<SharedLibrary> implements SharedLibraryRepository {
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        super("shared_library", db);
        this.id_user = id_user;
        this.sync = sync;
    }

    async get(id: string): Promise<SharedLibrary> {
        throw new Error("Method not implemented.");
    }

    async create(sharedLibrary: CreateSharedLibraryDto): Promise<void> {
        await this.create_base(sharedLibrary);
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

    // @ts-ignore
    @syncAfterMethod()
    async update(sharedLibrary: SharedLibrary): Promise<void> {
        await this.update_base(sharedLibrary, ["id_user", "id_library"]);
    }

    // @ts-ignore
    @syncAfterMethod()
    async delete(sharedLibrary: DeleteSharedLibraryDto): Promise<void> {
        await this.delete_base(sharedLibrary);
    }
}

export class RemoteSharedLibraryRepository implements SharedLibraryRepository {
    async get(id: string): Promise<SharedLibrary> {
        throw new Error("Method not implemented.");
    }

    async create(sharedLibrary: CreateSharedLibraryDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createAll(sharedLibraries: CreateSharedLibraryDto[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(sharedLibrary: SharedLibrary): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(sharedLibrary: DeleteSharedLibraryDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

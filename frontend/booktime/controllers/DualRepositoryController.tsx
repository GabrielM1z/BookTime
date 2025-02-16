import { Platform } from 'react-native';


export abstract class DualRepositoryController<L, R> {
    protected remote: R;
    protected local: L;

    constructor(api: R, sqlite: L) {
        this.remote = api;
        this.local = sqlite;
    }

    static isWeb(): boolean {
        return Platform.OS === 'web';
    }

    platform(): L | R{
        if (DualRepositoryController.isWeb()) {
            return this.remote;
        }
        return this.local;
    }
}

import { Platform } from 'react-native';


export abstract class AbstractController<T> {
    protected api: T;
    protected sqlite: T;

    constructor(api: T, sqlite: T) {
        this.api = api;
        this.sqlite = sqlite;
    }

    static isWeb(): boolean {
        return Platform.OS === 'web';
    }

    platform(): T {
        if (AbstractController.isWeb()) {
            return this.api;
        }
        return this.sqlite;
    }
}

import { Platform } from 'react-native';

// Define a type that combines the interface I with additional properties 'remote' and 'local'.
export type RepositoryProxy<I, R extends I, L extends I> = I & {
    remote: R;
    local: L;
};

// Function to create a proxy that dynamically routes method calls to either the remote or local repository.
export function proxyRepository<I extends object, R extends I, L extends I>(local: L, remote: R): RepositoryProxy<I, R, L> {
    const handler: ProxyHandler<any> = {
        get: (target, prop, receiver) => {
            if (prop === 'remote') {
                return remote;
            }
            if (prop === 'local') {
                return local;
            }
            const source: I = Platform.OS === 'web' ? remote : local;
            if (prop in source) {
                return Reflect.get(source, prop, receiver);
            }
            throw new Error(`Method ${String(prop)} not found in either remote or local repo`);
        }
    };

    return new Proxy({ remote, local }, handler) as RepositoryProxy<I, R, L>;
}

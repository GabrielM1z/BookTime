export function syncBeforeMethod() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        if (typeof originalMethod !== "function") {
            throw new Error(`@syncBeforeMethod can only be applied to methods, but received: ${typeof originalMethod}`);
        }

        descriptor.value = async function (...args: any[]) {
            if ("runSync" in this) {
                await (this as any).runSync();
            } else {
                console.warn(`Trying to run synchronisation for a non-synchronisable repo`);
            }
            return await originalMethod.apply(this, args);
        };
    };
}

export function syncAfterMethod() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        if (typeof originalMethod !== "function") {
            throw new Error(`@syncAfterMethod can only be applied to methods, but received: ${typeof originalMethod}`);
        }

        descriptor.value = async function (...args: any[]) {
            const result = await originalMethod.apply(this, args);
            if ("sync" in this) {
                (this as any).sync.runSync();
            } else {
                console.warn(`Trying to run synchronisation for a non-synchronisable repo`);
            }
            return result;
        };
    };
}

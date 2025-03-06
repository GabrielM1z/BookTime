export function syncBeforeMethod() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        if (typeof originalMethod !== "function") {
            throw new Error(`@syncBeforeMethod can only be applied to methods, but received: ${typeof originalMethod}`);
        }

        descriptor.value = async function (...args: any[]) {
            if ("sync" in this) {
                (this as any).sync.runSync();
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
            if ( "sync" in this ) {
                (this as any).sync.syncFlag = true;
            }
            const result = await originalMethod.apply(this, args);
            if ("sync" in this) {
                (this as any).sync.syncFlag = false;
                (this as any).sync.runSync();
            }
            return result;
        };
    };
}

// export function triggerInsert() {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         const originalMethod = descriptor.value;

//         if (typeof originalMethod !== "function") {
//             throw new Error(`@triggerInsert can only be applied to methods, but received: ${typeof originalMethod}`);
//         }

//         descriptor.value = async function (data: any, context: Context) {
//             const result = await originalMethod.apply(this, data, context);
//             if (!context.syncing) {
//                 (this as any).sync.action.createInsert(data, (this as any).tableName);
//             }
//             return result;
//         };
//     };
// }

// export function triggerUpdate() {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         const originalMethod = descriptor.value;

//         if (typeof originalMethod !== "function") {
//             throw new Error(`@triggerUpdate can only be applied to methods, but received: ${typeof originalMethod}`);
//         }

//         descriptor.value = async function (data: any, context: Context) {
//             const result = await originalMethod.apply(this, data, context);
//             if (!context.syncing) {
//                 (this as any).sync.action.createUpdate(data, (this as any).tableName);
//             }
//             return result;
//         };
//     };
// }

// export function triggerDelete() {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         const originalMethod = descriptor.value;

//         if (typeof originalMethod !== "function") {
//             throw new Error(`@triggerDelete can only be applied to methods, but received: ${typeof originalMethod}`);
//         }

//         descriptor.value = async function (data: any, context: Context) {
//             const result = await originalMethod.apply(this, data, context);
//             if (!context.syncing) {
//                 (this as any).sync.action.createDelete(data, (this as any).tableName);
//             }
//             return result;
//         };
//     };
// }

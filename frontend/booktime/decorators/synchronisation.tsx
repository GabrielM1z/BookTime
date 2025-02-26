import { runSynchronisation } from "@/services/synchronisation";

export function syncBefore(originalMethod: Promise<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            await runSynchronisation();
            return await originalMethod.apply(this, args);
        };
    }
}

export function syncAfter(originalMethod: Promise<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const result = await originalMethod.apply(this, args);
            await runSynchronisation();
            return result;
        }
    }
}
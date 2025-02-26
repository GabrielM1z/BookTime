import { useController } from "@/hooks/useController";
import { ControllerContextProps } from "@/providers/ControllerProvider";

export function syncBeforeMethod(service: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value; // Sauvegarde de la méthode originale

        if (typeof originalMethod !== "function") {
            throw new Error(`@syncBeforeMethod can only be applied to methods, but received: ${typeof originalMethod}`);
        }

        descriptor.value = async function (...args: any[]) {
            const controller = useController()[`${service}Controller` as keyof ControllerContextProps];
            await controller.runSynchronisation();
            return await originalMethod.apply(this, args);
        };
    };
}

// export function syncAfterMethod(service: string) {
//     return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
//         const originalMethod = descriptor.value;

//         descriptor.value = async function (...args: any[]) {
//             try {
//                 // Exécution de la méthode originale (supporte les méthodes sync et async)
//                 const result = await Promise.resolve(originalMethod.apply(this, args));

//                 // Récupération dynamique du contrôleur
//                 const controller = useController()?.[`${service}Controller` as keyof ControllerContextProps];

//                 // Vérification et exécution de la synchronisation
//                 if (controller && typeof controller.runSynchronisation === 'function') {
//                     await controller.runSynchronisation();
//                 } else {
//                     console.warn(`Le contrôleur "${service}Controller" ne possède pas runSynchronisation.`);
//                 }

//                 return result;
//             } catch (error) {
//                 console.error(`Erreur dans @syncAfterMethod(${propertyKey.toString()}):`, error);
//                 throw error; // Propager l'erreur
//             }
//         };

//         return descriptor;
//     };
// }

export function syncAfterMethod(service: string) {
    return async function (target: any, propertyKey: string, descriptor: PropertyDescriptor, ...args: any[]) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            console.log("syncAfterMethod");
            return await originalMethod.apply(this, args);
        };
    }
};

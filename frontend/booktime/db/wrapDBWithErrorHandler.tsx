import { SQLiteDatabase } from "expo-sqlite";

export function wrapDbWithErrorHandler(db: SQLiteDatabase) {
    return new Proxy(db, {
      get(target, prop: string) {
        const original = target[prop];
        if (typeof original === 'function') {
          return (...args) => {
            try {
              const result = original.apply(target, args);
              if (result instanceof Promise) {
                return result.catch(error => {
                  console.error(`Database Error in ${prop}:`, error);
                  throw new Error(`Database Error: ${error.message}`);
                });
              }
              return result;
            } catch (error) {
              console.error(`Database Error in ${prop}:`, error);
              throw new Error(`Database Error: ${error.message}`);
            }
          };
        }
        return original;
      }
    });
  }
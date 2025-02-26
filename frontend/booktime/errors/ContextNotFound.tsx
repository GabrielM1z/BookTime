export class ContextNotFound extends Error {
  constructor(hookName: string, contextName: string) {
    super(`To use ${hookName} you must wrap your component with ${contextName}`);
    this.name = "ContextNotFound";
  }
}


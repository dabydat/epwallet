export class ContextException extends Error {
    constructor(hookName: string, providerName: string) {
        super(`${hookName} must be used within a ${providerName}`);
        this.name = 'ContextException';
        Object.setPrototypeOf(this, ContextException.prototype);
    }
}

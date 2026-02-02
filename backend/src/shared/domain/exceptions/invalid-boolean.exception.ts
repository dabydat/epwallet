import { ValueObjectException } from "./value-object.exception";

export class BooleanException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid boolean value. ${message}`, BooleanException.name, details);
    }
}
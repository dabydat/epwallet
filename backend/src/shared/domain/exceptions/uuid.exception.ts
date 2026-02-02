import { ValueObjectException } from "./value-object.exception";

export class UuidException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid ID value. ${message}`, UuidException.name, details);
    }
}


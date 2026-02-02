import { ValueObjectException } from "./value-object.exception";

export class DocumentException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid document value. ${message}`, DocumentException.name, details);
    }
}

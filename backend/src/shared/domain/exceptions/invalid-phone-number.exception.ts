import { ValueObjectException } from "./value-object.exception";

export class PhoneNumberException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(`Invalid phone number value. ${message}`, PhoneNumberException.name, details);
    }
}
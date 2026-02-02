import { ValueObjectException } from './value-object.exception';

export class InvalidNameException extends ValueObjectException {
    constructor(name: string, details?: string) {
        super(`Invalid name value. ${name}`, InvalidNameException.name, details);
    }
}
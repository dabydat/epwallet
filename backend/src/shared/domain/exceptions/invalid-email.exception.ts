import { ValueObjectException } from '../exceptions/value-object.exception';

export class EmailException extends ValueObjectException {
    constructor(email: string, details?: string) {
        super(`Invalid email value. ${email}`, EmailException.name, details);
    }
}
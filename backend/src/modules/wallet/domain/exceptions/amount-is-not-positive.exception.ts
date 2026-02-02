import { ValueObjectException } from "src/shared/domain/exceptions/value-object.exception";

export class AmountIsNotPositiveException extends ValueObjectException {
    constructor(message: string = 'Amount is not positive', details?: string) {
        super(message, AmountIsNotPositiveException.name, details, { value: message });
    }
}
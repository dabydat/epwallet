import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class InsufficientFundsException extends DomainException {
    constructor(message: string = 'Insufficient funds', details?: string) {
        super(message, InsufficientFundsException.name, details, { value: message });
    }
}
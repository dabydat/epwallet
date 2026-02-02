import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export class TransactionNotFoundException extends DomainException {
    public constructor(message: string = `Transaction not found.`) {
        super(message, TransactionNotFoundException.name);
    }
}
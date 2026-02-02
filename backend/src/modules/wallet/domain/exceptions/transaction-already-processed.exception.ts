import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export class TransactionAlreadyProcessedException extends DomainException {
    public constructor(message: string = `Transaction already processed.`) {
        super(message, TransactionAlreadyProcessedException.name);
    }
}
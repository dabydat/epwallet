import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export class InvalidConfirmationTokenException extends DomainException {
    public constructor(message: string = `Invalid confirmation token.`) {
        super(message, InvalidConfirmationTokenException.name);
    }
}

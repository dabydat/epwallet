import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export class ExpiredTokenException extends DomainException {
    public constructor(message: string = `Expired token.`) {
        super(message, ExpiredTokenException.name);
    }
}

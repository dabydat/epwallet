import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class PhoneDoesNotMatchException extends DomainException {
    public constructor(message: string = `Phone does not match.`) {
        super(message, PhoneDoesNotMatchException.name);
    }
}

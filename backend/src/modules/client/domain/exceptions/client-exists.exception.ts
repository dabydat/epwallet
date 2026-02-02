import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export class ClientAlreadyExistsException extends DomainException {
    public constructor(message: string = `Client already exists.`) {
        super(message, ClientAlreadyExistsException.name);
    }
}

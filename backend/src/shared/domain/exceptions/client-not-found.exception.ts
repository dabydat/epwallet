import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class ClientNotFoundException extends DomainException {
    public constructor(message: string = `Client not found.`) {
        super(message, ClientNotFoundException.name);
    }
}

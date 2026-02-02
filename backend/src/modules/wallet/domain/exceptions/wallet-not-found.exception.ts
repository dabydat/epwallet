import { DomainException } from "src/shared/domain/exceptions/domain.exception";

export class WalletNotFoundException extends DomainException {
    public constructor(message: string = `Wallet not found.`) {
        super(message, WalletNotFoundException.name);
    }
}
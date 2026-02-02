import { Email } from '@shared/domain/value-objects/email.vo';
import { PhoneNumber } from '@shared/domain/value-objects/phone-number.vo';
import { Name } from '@shared/domain/value-objects/name.vo';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';
import { DocumentVO } from '@shared/domain/value-objects/document.vo';

export type ClientPrimitives = {
    id: string;
    document: string;
    name: string;
    email: string;
    phone: string;
};

export class Client {
    constructor(
        public readonly id: Uuid,
        public readonly document: DocumentVO,
        public readonly name: Name,
        public readonly email: Email,
        public readonly phone: PhoneNumber,
    ) { }

    public static create(
        id: Uuid,
        document: DocumentVO,
        name: Name,
        email: Email,
        phone: PhoneNumber,
    ): Client {
        return new Client(id, document, name, email, phone);
    }

    public toPrimitives(): ClientPrimitives {
        return {
            id: this.id.getValue,
            document: this.document.getValue,
            name: this.name.getValue,
            email: this.email.getValue,
            phone: this.phone.getValue,
        };
    }
}

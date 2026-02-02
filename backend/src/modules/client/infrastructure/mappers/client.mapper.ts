import { ClientEntity } from '../persistence/client.entity';
import { Client, ClientPrimitives } from '../../domain/models/client';
import { Email } from '@shared/domain/value-objects/email.vo';
import { PhoneNumber } from '@shared/domain/value-objects/phone-number.vo';
import { Name } from '@shared/domain/value-objects/name.vo';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';
import { DocumentVO } from '@shared/domain/value-objects/document.vo';

export class ClientMapper {
    static toEntity(domain: Client): ClientEntity {
        const primitives: ClientPrimitives = domain.toPrimitives();
        return new ClientEntity({
            id: primitives.id,
            document: primitives.document,
            name: primitives.name,
            email: primitives.email,
            phone: primitives.phone,
        });
    }

    static toDomain(entity: ClientEntity): Client {
        return Client.create(
            Uuid.create(entity.id),
            DocumentVO.create(entity.document),
            Name.create(entity.name),
            Email.create(entity.email),
            PhoneNumber.create(entity.phone),
        );
    }

    static toResponse(domain: Client) {
        const primitives: ClientPrimitives = domain.toPrimitives();
        return {
            id: primitives.id,
            document: primitives.document,
            name: primitives.name,
            email: primitives.email,
            phone: primitives.phone,
        };
    }
}
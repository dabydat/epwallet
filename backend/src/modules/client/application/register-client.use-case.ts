import { Inject, Injectable } from '@nestjs/common';
import { type ClientRepository, CLIENT_REPOSITORY } from '../domain/repositories/client.repository';
import { RegisterClientDto } from './dto/register-client.dto';
import { Client } from '../domain/models/client';
import { ClientAlreadyExistsException } from '../domain/exceptions/client-exists.exception';
import { Email } from '@shared/domain/value-objects/email.vo';
import { PhoneNumber } from '@shared/domain/value-objects/phone-number.vo';
import { Name } from '@shared/domain/value-objects/name.vo';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';
import { DocumentVO } from '@shared/domain/value-objects/document.vo';

@Injectable()
export class RegisterClientUseCase {
    constructor(
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepository: ClientRepository,
    ) { }

    async execute(dto: RegisterClientDto): Promise<Client> {
        const document = DocumentVO.create(dto.document);
        const email = Email.create(dto.email);
        const phone = PhoneNumber.create(dto.phone);
        const name = Name.create(dto.name);

        const existingClient = await this.clientRepository.findByDocument(document);
        if (existingClient) throw new ClientAlreadyExistsException('Client with this document already exists');

        const existingEmail = await this.clientRepository.findByEmail(email);
        if (existingEmail) throw new ClientAlreadyExistsException('Client with this email already exists');

        const existingPhone = await this.clientRepository.findByPhone(phone);
        if (existingPhone) throw new ClientAlreadyExistsException('Client with this phone already exists');

        const client = Client.create(
            Uuid.create(),
            document,
            name,
            email,
            phone,
        );

        await this.clientRepository.save(client);

        return client;
    }
}

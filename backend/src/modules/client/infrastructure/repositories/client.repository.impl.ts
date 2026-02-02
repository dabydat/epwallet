import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../domain/models/client';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { ClientEntity } from '../persistence/client.entity';
import { ClientMapper } from '../mappers/client.mapper';
import { Email } from '@shared/domain/value-objects/email.vo';
import { DocumentVO } from '@shared/domain/value-objects/document.vo';
import { PhoneNumber } from '@shared/domain/value-objects/phone-number.vo';

@Injectable()
export class ClientRepositoryImpl implements ClientRepository {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly repository: Repository<ClientEntity>,
    ) { }

    async save(client: Client): Promise<void> {
        const entity = ClientMapper.toEntity(client);
        await this.repository.save(entity);
    }

    async findByDocument(document: DocumentVO): Promise<Client | null> {
        const entity = await this.repository.findOne({ where: { document: document.getValue } });
        return entity ? ClientMapper.toDomain(entity) : null;
    }

    async findByEmail(email: Email): Promise<Client | null> {
        const entity = await this.repository.findOne({ where: { email: email.getValue } });
        return entity ? ClientMapper.toDomain(entity) : null;
    }

    async findByPhone(phone: PhoneNumber): Promise<Client | null> {
        const entity = await this.repository.findOne({ where: { phone: phone.getValue } });
        return entity ? ClientMapper.toDomain(entity) : null;
    }
}

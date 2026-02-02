import { DocumentVO } from '@shared/domain/value-objects/document.vo';
import { Client } from '../models/client';
import { Email } from '@shared/domain/value-objects/email.vo';
import { PhoneNumber } from '@shared/domain/value-objects/phone-number.vo';

export const CLIENT_REPOSITORY = Symbol('CLIENT_REPOSITORY');

export interface ClientRepository {
    save(client: Client): Promise<void>;
    findByDocument(document: DocumentVO): Promise<Client | null>;
    findByEmail(email: Email): Promise<Client | null>;
    findByPhone(phone: PhoneNumber): Promise<Client | null>;
}



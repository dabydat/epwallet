import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('clients')
export class ClientEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ unique: true })
    document: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    constructor(partial: Partial<ClientEntity>) {
        Object.assign(this, partial);
    }
}

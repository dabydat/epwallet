import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './infrastructure/client.controller';
import { RegisterClientUseCase } from './application/register-client.use-case';
import { ClientRepositoryImpl } from './infrastructure/repositories/client.repository.impl';
import { CLIENT_REPOSITORY } from './domain/repositories/client.repository';
import { ClientEntity } from './infrastructure/persistence/client.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ClientEntity])],
    controllers: [ClientController],
    providers: [
        RegisterClientUseCase,
        {
            provide: CLIENT_REPOSITORY,
            useClass: ClientRepositoryImpl,
        },
    ],
    exports: [CLIENT_REPOSITORY],
})
export class ClientModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { WalletController } from './infrastructure/wallet.controller';
import { WalletEntity } from './infrastructure/persistence/wallet.entity';
import { TransactionEntity } from './infrastructure/persistence/transaction.entity';
import { RechargeWalletUseCase } from './application/recharge-wallet.use-case';
import { RequestPaymentUseCase } from './application/request-payment.use-case';
import { ConfirmPaymentUseCase } from './application/confirm-payment.use-case';
import { GetBalanceQuery } from './application/get-balance.query';
import { WalletRepositoryImpl } from './infrastructure/repositories/wallet.repository.impl';
import { RedisTokenRepositoryImpl } from './infrastructure/repositories/redis-token.repository.impl';
import { ConsoleNotificationService } from '@modules/notification/infrastructure/console-notification.service';
import { WALLET_REPOSITORY } from './domain/repositories/wallet.repository';
import { TOKEN_REPOSITORY } from './domain/repositories/token.repository';
import { NOTIFICATION_SERVICE } from '@modules/notification/domain/notification.service';
import { UNIT_OF_WORK } from './domain/repositories/unit-of-work.interface';
import { UnitOfWorkImpl } from './infrastructure/repositories/unit-of-work.impl';
import { ClientModule } from '@modules/client/client.module';
import { RedisModule } from '@shared/infrastructure/redis';

@Module({
    imports: [
        TypeOrmModule.forFeature([WalletEntity, TransactionEntity]),
        ClientModule,
        RedisModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                host: config.get<string>('REDIS_HOST') || 'localhost',
                port: config.get<number>('REDIS_PORT') || 6379,
                password: config.get<string>('REDIS_PASSWORD'),
                db: config.get<number>('REDIS_DB') || 0,
            }),
        }),
    ],
    controllers: [WalletController],
    providers: [
        RechargeWalletUseCase,
        RequestPaymentUseCase,
        ConfirmPaymentUseCase,
        GetBalanceQuery,
        {
            provide: UNIT_OF_WORK,
            useClass: UnitOfWorkImpl,
        },
        {
            provide: WALLET_REPOSITORY,
            useClass: WalletRepositoryImpl,
        },
        {
            provide: TOKEN_REPOSITORY,
            useClass: RedisTokenRepositoryImpl,
        },
        {
            provide: NOTIFICATION_SERVICE,
            useClass: ConsoleNotificationService,
        },
    ],
})
export class WalletModule { }

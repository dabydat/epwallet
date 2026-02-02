import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './modules/client/client.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { DatabaseModule } from './modules/config/database/database.module';
import configuration from './modules/config';
import { configValidation } from './modules/config/config-validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configValidation,
    }),
    DatabaseModule,
    ClientModule,
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

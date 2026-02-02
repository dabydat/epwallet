import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/infrastructure/filters/all-exceptions.filter';
import { TransformResponseInterceptor } from './shared/infrastructure/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  const configService = app.get(ConfigService);

  const logger: Logger = new Logger();

  const port: number | undefined = configService.get<number | undefined>('api.port');
  const host: string | undefined = configService.get<string | undefined>('api.host');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  await app.listen(port as number, host as string);

  logger.log(`Running in ${port}`);
}
bootstrap();

import { DynamicModule, Global, Module, OnModuleDestroy, Provider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './constants/redis.constant';
import { RedisModuleOptions } from './interfaces/redis-options.interface';
import { RedisModuleAsyncOptions } from './interfaces/redis-async-options';

@Global()
@Module({})
export class RedisModule implements OnModuleDestroy {
    constructor(private readonly moduleRef: ModuleRef) { }

    static forRoot(options: RedisModuleOptions): DynamicModule {
        const redisProvider: Provider = {
            provide: REDIS_CLIENT,
            useFactory: (): Redis => {
                return new Redis({
                    host: options.host,
                    port: options.port,
                    password: options.password,
                    db: options.db || 0,
                });
            },
        };

        return {
            module: RedisModule,
            providers: [redisProvider],
            exports: [redisProvider],
        };
    }

    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        const redisProvider: Provider = {
            provide: REDIS_CLIENT,
            useFactory: async (...args: any[]): Promise<Redis> => {
                if (!options.useFactory) {
                    throw new Error('RedisModule: useFactory is required for async configuration');
                }
                const config = await options.useFactory(...args);
                return new Redis({
                    host: config.host,
                    port: config.port,
                    password: config.password,
                    db: config.db || 0,
                });
            },
            inject: options.inject || [],
        };

        return {
            module: RedisModule,
            providers: [redisProvider],
            exports: [redisProvider],
        };
    }

    async onModuleDestroy() {
        const redis = this.moduleRef.get<Redis>(REDIS_CLIENT, { strict: false });
        if (redis) {
            await redis.quit();
        }
    }
}

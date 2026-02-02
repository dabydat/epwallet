import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { TokenRepository } from '../../domain/repositories/token.repository';
import { REDIS_CLIENT } from '@shared/infrastructure/redis';

@Injectable()
export class RedisTokenRepositoryImpl implements TokenRepository, OnModuleDestroy {
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: Redis,
    ) { }

    onModuleDestroy() {
        this.redis.disconnect();
    }

    async saveToken(sessionId: string, token: string, ttlSeconds: number): Promise<void> {
        await this.redis.set(`token:${sessionId}`, token, 'EX', ttlSeconds);
    }

    async getToken(sessionId: string): Promise<{ token: string } | null> {
        const stored = await this.redis.get(`token:${sessionId}`);
        return stored ? { token: stored } : null;
    }

    async validateToken(sessionId: string, token: string): Promise<boolean> {
        const stored = await this.redis.get(`token:${sessionId}`);
        return stored === token;
    }

    async deleteToken(sessionId: string): Promise<void> {
        await this.redis.del(`token:${sessionId}`);
    }
}

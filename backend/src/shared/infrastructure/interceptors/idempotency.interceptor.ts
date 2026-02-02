import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@shared/infrastructure/redis';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: Redis,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
            return next.handle();
        }

        const idempotencyKey = request.headers['x-idempotency-key'];

        if (!idempotencyKey) {
            return next.handle();
        }

        const cachedResponse = await this.redis.get(`idempotency:${idempotencyKey}`);
        if (cachedResponse) {
            const response = JSON.parse(cachedResponse);
            return of(response);
        }

        return next.handle().pipe(
            tap(async (response) => {
                await this.redis.set(
                    `idempotency:${idempotencyKey}`,
                    JSON.stringify(response),
                    'EX',
                    30 * 60
                );
            }),
        );
    }
}

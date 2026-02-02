import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../domain/responses/api-response.interface';

@Injectable()
export class TransformResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => ({
                status: context.switchToHttp().getResponse().statusCode,
                message: 'Operation successful', // Can be customized per handler using Reflector if needed
                data: data || null,
                error: null,
            })),
        );
    }
}

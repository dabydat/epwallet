import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../../domain/responses/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException ? exception.getResponse() : null;

        let errorMessage = 'Internal Server Error';
        let errorDetail = null;

        if (typeof exceptionResponse === 'string') {
            errorMessage = exceptionResponse;
        } else if (
            exceptionResponse &&
            typeof exceptionResponse === 'object' &&
            'message' in exceptionResponse
        ) {
            // Handle NestJS standard error structure (e.g. class-validator)
            const msg = (exceptionResponse as any).message;
            errorMessage = Array.isArray(msg) ? msg.join(', ') : msg;
            errorDetail = exceptionResponse;
        } else if (exception instanceof Error) {
            errorMessage = exception.message;
        }

        const body: ApiResponse<null> = {
            status,
            message: 'Operation failed',
            data: null,
            error: errorMessage,
        };

        response.status(status).json(body);
    }
}

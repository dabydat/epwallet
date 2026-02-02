import { HttpException, HttpStatus } from "@nestjs/common";

export interface ErrorDetail {
    message: string;
    code: string;
    param?: string | number;
}

export abstract class DomainException extends HttpException {
    public readonly key: string;
    public readonly args: Record<string, any>;
    constructor(message: string, code: string, param?: string, args?: Record<string, any>) {
        const details: ErrorDetail[] = [{ message, code, param }];
        super({
            message,
            code,
            details,
            args: args || {}
        }, HttpStatus.BAD_REQUEST);
        this.key = message;
        this.args = args || {};
    }
}

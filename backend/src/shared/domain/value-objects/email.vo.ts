import { EmailException } from '../exceptions/invalid-email.exception';
import ValueObject from './value-object';

interface EmailProps {
    value: string;
}

export class Email extends ValueObject<EmailProps> {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    private constructor(private readonly value: string) {
        super({ value });
    }

    public static create(value: string): Email {
        Email.validate(value);
        return new Email(value);
    }

    private static validate(value: string): void {
        if (!Email.EMAIL_REGEX.test(value)) {
            throw new EmailException(value);
        }
    }

    public get getValue(): string {
        return this.value;
    }
}

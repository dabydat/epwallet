import { PhoneNumberException } from '../exceptions/invalid-phone-number.exception';
import ValueObject from './value-object';

interface PhoneNumberProps {
    value: string;
}

export class PhoneNumber extends ValueObject<PhoneNumberProps> {
    private static readonly PHONE_REGEX = /^\d{10}$/;

    private constructor(private readonly value: string) {
        super({ value });
    }

    public static create(value: string): PhoneNumber {
        PhoneNumber.validate(value);
        return new PhoneNumber(value);
    }

    private static validate(value: string): void {
        if (!PhoneNumber.PHONE_REGEX.test(value)) {
            throw new PhoneNumberException('Phone number must be exactly 10 digits');
        }
    }

    public get getValue(): string {
        return this.value;
    }
}

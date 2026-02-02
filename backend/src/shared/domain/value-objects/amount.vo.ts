import ValueObject from './value-object';
import { BooleanVO } from './boolean-vo';
import { AmountException } from '../exceptions/invalid-amount.exception';

interface AmountProps {
    value: number;
}

export class Amount extends ValueObject<AmountProps> {
    private constructor(private readonly value: number) {
        super({ value });
    }

    public static create(
        value: number,
        fromDB: BooleanVO = BooleanVO.create(false),
    ): Amount {
        Amount.validate(value);
        if (!fromDB.getValue) {
            return new Amount(Math.round(value * 100));
        }
        return new Amount(value);
    }

    public static getAmount(cents: number | string): Amount {
        const value = typeof cents === 'string' ? Number(cents) : cents;
        if (!Number.isInteger(value) || value < 0) {
            throw new AmountException('Cents must be a positive integer.');
        }
        return new Amount(value);
    }

    private static validate(value: number): void {
        if (typeof value !== 'number' || value < 0 || !isFinite(value)) {
            throw new AmountException('must be a positive number.');
        }
    }

    public static fromDecimal(value: number | string): Amount {
        if (typeof value === 'string') {
            const cleaned = value.replace(/,/g, '');
            value = parseFloat(cleaned);
        }

        if (isNaN(value)) {
            throw new AmountException('Invalid decimal value for amount.');
        }

        const cents = Math.round(value * 100);
        return new Amount(cents);
    }

    public add(other: Amount): Amount {
        return new Amount(this.value + other.value);
    }

    public isLessThan(other: Amount): boolean {
        return this.value < other.value;
    }

    public isGreaterThan(other: Amount): boolean {
        return this.value > other.value;
    }

    public subtract(other: Amount): Amount {
        const result = this.value - other.value;
        if (result < 0) {
            throw new AmountException('Resulting amount cannot be negative.');
        }
        return new Amount(result);
    }

    public static fromCents(cents: number): Amount {
        return new Amount(cents);
    }

    public get getValue(): number {
        return this.value;
    }

    public toDecimal(): number {
        return this.value / 100;
    }

    public toCents(): number {
        return this.value;
    }

    public toDecimalString(): string {
        const value = this.value;
        const integerPart = Math.floor(value / 100);
        const decimalPart = Math.abs(value % 100);
        return `${integerPart}.${decimalPart.toString().padStart(2, '0')}`;
    }

    public format(currency: string = 'USD', locale: string = 'en-US'): string {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(this.toDecimal());
    }
}

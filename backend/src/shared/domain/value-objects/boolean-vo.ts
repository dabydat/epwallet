import { BooleanException } from '../exceptions/invalid-boolean.exception';
import ValueObject from './value-object';

interface BooleanProps {
    value: boolean;
}

export class BooleanVO extends ValueObject<BooleanProps> {
    private constructor(private readonly value: boolean) {
        super({ value });
    }

    public static create(value: boolean): BooleanVO {
        BooleanVO.validate(value);
        return new BooleanVO(Boolean(value));
    }

    private static validate(value: boolean): void {
        if (typeof value !== 'boolean') {
            throw new BooleanException(value);
        }
    }

    public get getValue(): boolean {
        return this.value;
    }
}

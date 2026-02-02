import { ValueObjectException } from './value-object.exception';

export class UtcDateException extends ValueObjectException {
  constructor(value: string, details?: string) {
    const message: string = `Invalid date value. ${value}`;
    super(message, UtcDateException.name, details);
  }
}

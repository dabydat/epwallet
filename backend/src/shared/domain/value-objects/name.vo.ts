import { InvalidNameException } from "../exceptions/invalid-name.exception";
import ValueObject from "./value-object";


interface NameProps {
  value: string;
}

export class Name extends ValueObject<NameProps> {
  private constructor(private readonly value: string) {
    super({ value });
  }

  public static create(value: string): Name {
    if (!value || value.trim().length === 0) {
      throw new InvalidNameException(value);
    }
    if (value.length > 30) {
      throw new InvalidNameException(value);
    }
    return new Name(value.trim());
  }

  public get getValue(): string {
    return this.value;
  }
}
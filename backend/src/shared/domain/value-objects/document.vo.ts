import ValueObject from "./value-object";
import { DocumentException } from "../exceptions/invalid-document.exception";

interface DocumentProps {
    value: string;
}

export class DocumentVO extends ValueObject<DocumentProps> {
    private constructor(private readonly value: string) {
        super({ value });
    }

    public static create(value: string): DocumentVO {
        if (!value || value.trim().length < 5 || value.trim().length > 15) {
            throw new DocumentException('Document must be between 5 and 15 characters', value);
        }

        // Basic alphanumeric check
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
            throw new DocumentException('Document must be alphanumeric', value);
        }

        return new DocumentVO(value.trim());
    }

    public get getValue(): string {
        return this.value;
    }
}

import { shallowEqual } from 'shallow-equal-object';

export interface ValueObjectProps {
    [index: string]: any;
}

export default abstract class ValueObject<T extends ValueObjectProps> {
    public readonly props: T;

    protected constructor(props: T) {
        this.props = Object.freeze(props);
    }

    public get(propertyName: keyof T): any {
        return this.props[propertyName];
    }

    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return shallowEqual(this.props, vo.props);
    }
}

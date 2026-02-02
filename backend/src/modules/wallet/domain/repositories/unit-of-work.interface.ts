import { EntityManager } from 'typeorm';

export const UNIT_OF_WORK = Symbol('UNIT_OF_WORK');

export interface UnitOfWork {
  execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T>;
}

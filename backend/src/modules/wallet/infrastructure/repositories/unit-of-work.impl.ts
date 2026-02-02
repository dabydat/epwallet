import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { UnitOfWork } from '../../domain/repositories/unit-of-work.interface';

@Injectable()
export class UnitOfWorkImpl implements UnitOfWork {
  constructor(private readonly dataSource: DataSource) { }
  async execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(work);
  }
}

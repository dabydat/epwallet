import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { RedisModuleOptions } from './redis-options.interface';

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => RedisModuleOptions | Promise<RedisModuleOptions>;
}

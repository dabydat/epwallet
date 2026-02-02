import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { UppercaseSnakeNamingStrategy } from './naming-strategy.config';

config({ path: '.env' });

const databasePort = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306;

export const databaseConfig: DataSourceOptions = {
  migrationsTableName: 'MIGRATIONS',
  namingStrategy: new UppercaseSnakeNamingStrategy(),
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: databasePort,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
  logging: true,
  timezone: 'Z',
};

export const AppDataSource = new DataSource(databaseConfig);

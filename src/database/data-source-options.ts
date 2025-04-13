import { MIGRATIONS_TABLE_NAME } from 'database/common/constants/migrations-table-name.const';
import { environment } from 'database/common/environment';
import { join } from 'path';
import type { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  isDevelopment,
} = environment;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/*.{ts,js}')],
  migrationsTableName: MIGRATIONS_TABLE_NAME,
  migrationsRun: !isDevelopment,
  namingStrategy: new SnakeNamingStrategy(),
  ...(!isDevelopment && { ssl: { rejectUnauthorized: false } }),
  // logging: isDevelopment,
};

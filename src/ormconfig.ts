import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'mysql',
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_SCHEMA),
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: ['src/database/migration/*{.ts,.js}'],
  trace: true,
};

export = config;

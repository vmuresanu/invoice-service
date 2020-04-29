import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'bookstore',
  entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: true,
  logging: true,
};

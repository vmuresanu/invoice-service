import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { Invoice } from './modules/invoice/entity/invoice.entity';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './infrastucture/http-error.filter';
import { LoggingInterceptor } from './infrastucture/logging.interceptor';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entity/user';
import { ContextService } from './infrastucture/context.service';
import { InfrastructureModule } from './infrastucture/infrastructure.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'bookstore',
      synchronize: true,
      logging: true,
      entities: [Invoice, User],
    }),
    InvoiceModule,
    InfrastructureModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ContextService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
}

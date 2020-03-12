import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { Invoice } from './modules/invoice/entity/invoice.entity';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './infrastucture/http-error.filter';
import { LoggingInterceptor } from './infrastucture/logging.interceptor';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entity/user.entity';
import { AuthModule } from './infrastucture/auth/auth.module';
import { InvoiceStatus } from './modules/invoice-status/entity/invoice-status.entity';
import { getMetadataArgsStorage } from 'typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    InvoiceModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ]
})
export class AppModule {
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './infrastucture/auth/auth.module';
import { getMetadataArgsStorage } from 'typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { HttpErrorFilter } from 'core-service-vm/dist/core-service-module/util/http-error.filter';
import { LoggingInterceptor } from 'core-service-vm/dist/core-service-module/util/logging.interceptor';

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

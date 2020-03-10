import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entity/invoice.entity';
import { InvoiceService } from './invoice.service';
import { InfrastructureModule } from '../../infrastucture/infrastructure.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}

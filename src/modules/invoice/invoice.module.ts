import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceStatusRepository } from '../invoice-status/invoice-status.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceRepository,
      InvoiceStatusRepository
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService]
})
export class InvoiceModule {}

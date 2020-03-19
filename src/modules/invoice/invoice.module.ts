import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceStatusRepository } from '../invoice-status/invoice-status.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceRepository,
      InvoiceStatusRepository
    ]),
    ClientsModule.register([
      { 
        name: 'ORDER_SERVICE', 
        transport: Transport.TCP, 
        options: { host: '127.0.0.1', port: 3001 }
      },
    ])
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService]
})
export class InvoiceModule { }

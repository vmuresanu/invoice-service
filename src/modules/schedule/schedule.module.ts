import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceRepository } from '../invoice/invoice.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleRepository, InvoiceRepository])],
  controllers: [ScheduleController],
  providers: [ScheduleService]
})
export class ScheduleModule {}

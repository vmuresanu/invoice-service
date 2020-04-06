import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { ScheduleRepository } from './schedule.repository';
import { PaginationOptions } from '../../infrastucture/pagination/pagination-options.interface';
import { Paginator } from '../../infrastucture/pagination/paginator.interface';
import { ScheduleResponse } from './entity/schedule.response';
import { plainToClass } from 'class-transformer';
import { constructPagination } from '../../infrastucture/pagination/pagination-function';
import { Invoice } from '../invoice/entity/invoice.entity';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { ScheduleRequest } from './entity/schedule.request';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: ScheduleRepository,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: InvoiceRepository,
  ) { }

  async getSchedules(options: PaginationOptions, invoiceId?: string): Promise<Paginator<ScheduleResponse[]>> {
    let condition = {
      take: options.limit,
      skip: options.limit * (options.page - 1),
    };

    if (invoiceId) {
      condition['where'] = { invoiceId };
    }

    return this.scheduleRepository
      .findAndCount(condition)
      .then(([schedules, totalItems]) => {
        options.total = totalItems;
        return constructPagination<ScheduleResponse>(plainToClass(ScheduleResponse, schedules), options);
      });
  }

  async getScheduleById(id: string): Promise<ScheduleResponse> {
    return this.scheduleRepository
      .findOne({ where: { id } })
      .then((schedule: Schedule) => {
        if (!schedule) {
          throw new HttpException('Schedule with given id Not found', HttpStatus.NOT_FOUND);
        }
        return plainToClass(ScheduleResponse, schedule);
      })
  }

  async createSchedule(invoiceId: string, scheduleRequest: ScheduleRequest): Promise<ScheduleResponse> {
    const invoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
    if (!invoice) {
      throw new HttpException('Invoice with given id Not found', HttpStatus.NOT_FOUND);
    }
    const schedule = this.scheduleRepository.create(scheduleRequest);
    schedule.invoiceId = invoiceId;
    return this.scheduleRepository
      .save(schedule)
      .then((schedule: Schedule) => {
        return plainToClass(ScheduleResponse, schedule);
      })
  }
}

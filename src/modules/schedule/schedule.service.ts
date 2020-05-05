import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { constructMomentDateTime } from '../../helpers/helpers';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: ScheduleRepository,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: InvoiceRepository,
  ) {
  }

  async getSchedules(options: PaginationOptions, invoiceId?: string): Promise<Paginator<ScheduleResponse[]>> {
    const condition = {
      take: options.limit,
      skip: options.limit * (options.page - 1),
    };

    if (invoiceId) {
      condition.where = { invoiceId };
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
      });
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
      });
  }

  async updateSchedule(id: string, scheduleRequest: Partial<ScheduleRequest>): Promise<ScheduleResponse> {
    const schedule = await this.scheduleRepository
      .findOne({
        where: { id },
      });

    if (!schedule) {
      throw new HttpException('Schedule with such id doesn\'t exist', HttpStatus.NOT_FOUND);
    }

    // Determine whether startDate and endDate are both present
    const shouldCheckDateTime = !!((scheduleRequest.startDate || schedule.startDate) && (scheduleRequest.endDate || schedule.endDate));

    if (shouldCheckDateTime) {
      const startDateTime = constructMomentDateTime(
        scheduleRequest.startDate || schedule.startDate,
        scheduleRequest.startTime || schedule.startTime,
      );
      const endDateTime = constructMomentDateTime(
        scheduleRequest.endDate || schedule.endDate,
        scheduleRequest.endTime || schedule.endTime,
      );
      if (startDateTime.isAfter(endDateTime)) {
        throw new HttpException('startDateTime can\'t be after endDateTime', HttpStatus.BAD_REQUEST);
      }
    }
    return this.scheduleRepository
      .save({ ...schedule, ...scheduleRequest })
      .then((schedule: Schedule) => {
        return plainToClass(ScheduleResponse, schedule);
      });
  }

  async deleteSchedule(id: string): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new HttpException('Schedule with such id doesn\'t exist', HttpStatus.NOT_FOUND);
    }

    await this.scheduleRepository.delete({ id });
  }
}

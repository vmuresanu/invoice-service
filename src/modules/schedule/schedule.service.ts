import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { ScheduleRepository } from './schedule.repository';
import { PaginationOptions } from '../../infrastucture/pagination/pagination-options.interface';
import { Paginator } from '../../infrastucture/pagination/paginator.interface';
import { ScheduleResponse } from './entity/schedule.response';
import { plainToClass } from 'class-transformer';
import { constructPagination } from '../../infrastucture/pagination/pagination-function';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: ScheduleRepository,
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
}

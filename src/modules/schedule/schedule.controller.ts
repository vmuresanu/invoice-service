import { Controller, Get, Query, Param } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Paginator } from '../../infrastucture/pagination/paginator.interface';
import { ScheduleResponse } from './entity/schedule.response';

@Controller('schedules')
export class ScheduleController {

  constructor(private readonly scheduleService: ScheduleService) {
  }

  @Get()
  async getSchedules(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('invoiceId') invoiceId: string,
  ): Promise<Paginator<ScheduleResponse[]>> {
    return this.scheduleService.getSchedules({ page, limit }, invoiceId);
  }

  @Get(':id')
  async getScheduleById(@Param('id') id): Promise<ScheduleResponse> {
    return this.scheduleService.getScheduleById(id);
  }

}

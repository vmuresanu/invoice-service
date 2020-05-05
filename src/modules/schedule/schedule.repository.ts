import { EntityRepository, Repository } from 'typeorm';
import { Schedule } from './entity/schedule.entity';

@EntityRepository(Schedule)
export class ScheduleRepository extends Repository<Schedule> {

}
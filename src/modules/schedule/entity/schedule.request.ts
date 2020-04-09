import { IsNumber, IsISO8601, Validate, IsString } from "class-validator";
import { IsBeforeConstraint, IsBeforeTimeIfDateConstraint, IsSameOrBeforeConstraint } from "../../../shared/constraints/date-is-before.constraint";

export class ScheduleRequest {
  @IsNumber()
  rate: number;

  @IsNumber()
  numberOfSpots

  @Validate(IsSameOrBeforeConstraint, ['endDate'])
  @IsISO8601()
  startDate: Date;

  @IsISO8601()
  endDate: Date;

  @Validate(IsBeforeTimeIfDateConstraint, [
    'startDate',
    'endDate',
    'endTime',
  ])
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
import { IsISO8601, IsNumber, IsString, Validate } from 'class-validator';
import { IsBeforeConstraint } from '../../../shared/constraints/date-is-before.constraint';

export class InvoiceRequest {

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @Validate(IsBeforeConstraint, ['endDate'])
  @IsISO8601()
  startDate: Date;

  @IsISO8601()
  endDate: Date;
}

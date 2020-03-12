import { IsISO8601, IsNumber, IsString } from 'class-validator';

export class InvoiceRequest {

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsISO8601 ()
  startDate: string;

  @IsISO8601()
  endDate: string;
}

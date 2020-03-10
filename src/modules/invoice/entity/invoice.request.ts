import { IsDecimal, IsNumber, IsString } from 'class-validator';

export class InvoiceRequest {

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
}

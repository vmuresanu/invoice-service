import { Exclude, Expose, Type } from 'class-transformer';
import { InvoiceStatus } from '../../invoice-status/entity/invoice-status.entity';
import { InvoiceStatusResponse } from '../../invoice-status/entity/invoice-status.response';

export class InvoiceResponse {
  @Expose({ name: 'uuid' })
  id: string;

  title: string;

  description: string;

  price: number;

  startDate: Date;

  endDate: Date;

  @Type(() => InvoiceStatusResponse)
  status: InvoiceStatusResponse;

  @Exclude()
  created: string;
}

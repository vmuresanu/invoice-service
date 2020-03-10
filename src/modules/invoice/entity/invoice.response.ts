import { Exclude, Expose } from 'class-transformer';

export class InvoiceResponse {
  @Expose({name: 'uuid'})
  id: string;

  title: string;

  description: string;

  price: number;

  @Exclude()
  created: string;
}

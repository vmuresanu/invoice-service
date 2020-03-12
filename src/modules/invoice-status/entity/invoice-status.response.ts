import { Exclude, Expose } from 'class-transformer';
import { CodeEnum } from '../../../shared/model/code.enum';

@Exclude()
export class InvoiceStatusResponse {
  @Expose()
  code: CodeEnum
}

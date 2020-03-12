import { EntityRepository, Repository } from 'typeorm';
import { InvoiceStatus } from './entity/invoice-status.entity';

@EntityRepository(InvoiceStatus)
export class InvoiceStatusRepository extends Repository<InvoiceStatus> {

}

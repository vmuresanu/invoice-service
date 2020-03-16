import { EntityRepository, Repository } from 'typeorm';
import { Invoice } from './entity/invoice.entity';

@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {
    async findByUUIDs(ids: string[]): Promise<Invoice[]> {
        return await this.manager.createQueryBuilder(Invoice, 'invoice')  // manager can be repository or connection objects too
            .where(`invoice.uuid IN (:...ids)`, { ids })
            .getMany();
    }
}

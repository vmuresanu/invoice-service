import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Enum } from '../../../shared/decorators/enum.decorator';
import { CodeEnum } from '../../../shared/model/code.enum';

@Entity('invoice_status')
export class InvoiceStatus extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Enum(type => CodeEnum, { default: CodeEnum.DRAFT })
  code: CodeEnum;

  @Column('text')
  description;
}

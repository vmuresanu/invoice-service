import { BaseEntity, Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InvoiceStatus } from '../../invoice-status/entity/invoice-status.entity';

@Entity('invoice')
export class Invoice extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  @Generated("uuid")
  uuid: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @ManyToOne(type => InvoiceStatus)
  status: InvoiceStatus;
}

import { BaseEntity, Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { InvoiceStatus } from '../../invoice-status/entity/invoice-status.entity';
import { Schedule } from '../../schedule/entity/schedule.entity';

@Entity('invoice')
export class Invoice extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  @Generated('uuid')
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

  @OneToMany(type => Schedule, schedule => schedule.invoice)
  schedules: Schedule[];
}

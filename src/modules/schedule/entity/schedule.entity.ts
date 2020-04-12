import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from "../../invoice/entity/invoice.entity";

@Entity('schedule')
export class Schedule {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 5, scale: 2 })
  rate: number;

  @Column('int', { name: 'number_of_spots' })
  numberOfSpots: number;

  @Column('date', { name: 'start_date' })
  startDate: Date;

  @Column('date', { name: 'end_date' })
  endDate: Date;

  @Column('time', { name: 'start_time' })
  startTime: string;

  @Column('time', { name: 'end_time' })
  endTime: string;

  @Column('varchar', { name: 'days_of_week', length: '7' })
  daysOfWeek: string;

  @Column("varchar", { name: 'invoice_id', nullable: true })
  invoiceId: string;

  @ManyToOne(type => Invoice, invoice => invoice.schedules)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;
}

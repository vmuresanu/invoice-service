import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoice')
export class Invoice {

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

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;
}

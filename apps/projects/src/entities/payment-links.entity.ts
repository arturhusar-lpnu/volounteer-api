import { PaymentTypes } from '@app/common/constants/enums';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity('payment-links')
export class PaymentLinks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PaymentTypes,
  })
  type: PaymentTypes;

  @Column()
  url: string;

  @ManyToOne(() => Project, (project) => project.paymentLinks)
  project: Project;
}

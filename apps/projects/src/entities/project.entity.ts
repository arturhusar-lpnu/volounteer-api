import { ProjectStatus } from '@app/common/constants/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { PaymentLinks } from './payment-links.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
  })
  status: ProjectStatus;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => PaymentLinks, (paymentLink) => paymentLink.project)
  paymentLinks: PaymentLinks[];

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  militaryUnitId: string;
}

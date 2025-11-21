import { PaymentTypes } from '@app/common/constants/enums';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}

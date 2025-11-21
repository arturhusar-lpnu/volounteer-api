import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { USER_ROLES } from '@app/common/constants/enums/user-roles.enum';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: USER_ROLES,
    unique: true,
  })
  name: USER_ROLES;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Enrollments } from './enrollments.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @OneToMany(() => Enrollments, (enrollment) => enrollment.user, {
    createForeignKeyConstraints: false,
  })
  enrollments: Enrollments[];
}

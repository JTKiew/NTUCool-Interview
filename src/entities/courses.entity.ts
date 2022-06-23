import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Enrollments } from './enrollments.entity';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    readonly: true,
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(() => Enrollments, (enrollment) => enrollment.course, {
    createForeignKeyConstraints: false,
  })
  enrollments: Enrollments[];
}

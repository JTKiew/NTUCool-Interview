import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Courses } from './courses.entity';
import { Users } from './users.entity';

@Entity()
export class Enrollments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  userId: number;

  @Column({
    nullable: false,
  })
  courseId: number;

  @Column({
    nullable: false,
  })
  role: string;

  @ManyToOne(() => Users, (user) => user.enrollments, {
    createForeignKeyConstraints: false,
  })
  // map to Users.id by Enrollments.userId
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Users;

  @ManyToOne(() => Courses, (course) => course.enrollments, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'courseId', referencedColumnName: 'id' })
  course: Courses;
}

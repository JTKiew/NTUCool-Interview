import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollments } from 'src/entities';
import { CourseModule } from '../course/course.module';
import { UserModule } from '../user/user.module';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  imports: [UserModule, CourseModule, TypeOrmModule.forFeature([Enrollments])],
})
export class EnrollmentModule {}

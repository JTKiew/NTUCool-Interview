import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollmentData } from 'src/database';
import { Enrollments } from 'src/entities';
import { Repository } from 'typeorm';
import { CourseService } from '../course/course.service';
import { UserService } from '../user/user.service';

@Injectable()
export class EnrollmentService implements OnModuleInit {
  async onModuleInit() {
    await this.enrollmentsRepository.clear();
    await this.enrollmentsRepository.save(EnrollmentData);
  }

  @InjectRepository(Enrollments)
  private enrollmentsRepository: Repository<Enrollments>;
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(CourseService)
  private readonly courseService: CourseService;

  async queryCourseUsers(courseId: number): Promise<Enrollments[]> {
    if (!this.courseService.isValidId(courseId))
      throw new BadRequestException('Invalid courseId!');

    const exist = await this.enrollmentsRepository.findOneBy({
      courseId: Number(courseId),
    });

    if (!exist)
      throw new BadRequestException(`No enrollment with courseId ${courseId}!`);

    const users: any = await this.enrollmentsRepository
      .createQueryBuilder('Enrollments')
      .leftJoin('Enrollments.user', 'user')
      .where('Enrollments.courseId = :courseId', { courseId: Number(courseId) })
      .select(['user'])
      .orderBy('user.id', 'ASC')
      .distinct(true)
      .getRawMany();
    return users;
  }

  async addEnrollment(
    userId: number,
    courseId: number,
    role: 'student' | 'teacher',
  ): Promise<Enrollments> {
    // if the field is not provided in http req, we might received undefined input value
    if (userId == null || courseId == null || role == null)
      throw new BadRequestException('Invalid userId, courseId or role!');

    if (!this.userService.isValidId(userId))
      throw new BadRequestException('Invalid userId!');

    if (!this.courseService.isValidId(courseId))
      throw new BadRequestException('Invalid courseId!');

    if (role !== 'student' && role !== 'teacher')
      throw new BadRequestException('Invalid role!');

    const exist = await this.enrollmentsRepository.findOneBy({
      userId: Number(userId),
      courseId: Number(courseId),
      role: role,
    });

    if (exist === null) {
      const newEnrollment = this.enrollmentsRepository.create({
        userId: Number(userId),
        courseId: Number(courseId),
        role: role,
      });

      await this.enrollmentsRepository.save(newEnrollment);
      return newEnrollment;
    } else {
      throw new BadRequestException('Enrollment Existed!');
    }
  }

  async deleteEnrollmentById(enrollmentId: number): Promise<Enrollments> {
    const enrollment = await this.enrollmentsRepository.findOneBy({
      id: Number(enrollmentId),
    });
    if (enrollment) {
      return await this.enrollmentsRepository.remove(enrollment);
    } else throw new BadRequestException('Invalid enrollmentId!');
  }

  async getEnrollmentById(enrollmentId: number): Promise<Enrollments> {
    const enrollment = await this.enrollmentsRepository.findOneBy({
      id: Number(enrollmentId),
    });
    if (enrollment) return enrollment;
    else throw new BadRequestException('Invalid enrollmentId!');
  }

  async queryEnrollments(
    userId: number,
    courseId: number,
    role: 'student' | 'teacher',
  ): Promise<Enrollments[]> {
    const filter: { [key: string]: any } = {};

    // if userId not empty string or undefined, userId used as query parameter
    if (userId && String(userId) !== '') {
      if (this.userService.isValidId(userId)) filter.userId = Number(userId);
      else throw new BadRequestException('Invalid userId!');
    }

    // if courseId not empty string or undefined, courseId used as query parameter
    if (courseId && String(courseId) !== '') {
      if (this.courseService.isValidId(courseId))
        filter.courseId = Number(courseId);
      else throw new BadRequestException('Invalid courseid!');
    }

    // if role not empty string or undefined, role used as query parameter
    if (String(role) !== '' && role != null) {
      if (role !== 'student' && role !== 'teacher')
        throw new BadRequestException('Invalid role!');
      else filter.role = role;
    }

    // extract enrollments which match the filters
    if (Object.keys(filter).length === 0)
      throw new BadRequestException('No query parameters provided!');

    const enrollments = await this.enrollmentsRepository.find({
      where: filter,
    });

    return enrollments;
  }

  async queryUserCourses(userId: number): Promise<Enrollments[]> {
    if (!this.courseService.isValidId(userId))
      throw new BadRequestException('Invalid userId!');

    const exist = await this.enrollmentsRepository.findOneBy({
      userId: Number(userId),
    });

    if (!exist)
      throw new BadRequestException(`No enrollment with userId ${userId}!`);

    const courses: any = await this.enrollmentsRepository
      .createQueryBuilder('Enrollments')
      .leftJoin('Enrollments.course', 'course')
      .where('Enrollments.userId = :userId', { userId: Number(userId) })
      .select(['course'])
      .orderBy('course.id', 'ASC')
      .distinct(true)
      .getRawMany();

    return courses;
  }

  async isValidId(enrollmentId: number): Promise<boolean> {
    // courseId might be string due to runtime, Number() to convert it
    const exist = await this.enrollmentsRepository.findOneBy({
      id: Number(enrollmentId),
    });
    return exist === null ? false : true;
  }
}

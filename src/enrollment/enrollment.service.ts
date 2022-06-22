import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { Courses, Enrollments, Student, Teacher, Users } from 'src/database';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EnrollmentService {
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(CourseService)
  private readonly courseService: CourseService;

  private enrollments: Enrollments[] = [];
  private id = 0;

  queryCourseUsers(courseId: number): Users[] {
    if (!this.courseService.isValidId(courseId))
      throw new BadRequestException('Invalid courseId!');

    if (!this.enrollments.some((obj) => obj.courseId === courseId))
      throw new BadRequestException(`No enrollment with courseId ${courseId}!`);

    let users: Users[] = [];
    this.enrollments.forEach((obj) => {
      if (obj.courseId === courseId)
        users.push(this.userService.getUser(obj.userId));
    });
    users.sort((a, b) => (b.id < a.id ? 1 : b.id > a.id ? -1 : 0));
    users = users.filter((obj, i) => i === users.indexOf(obj));

    return users;
  }

  addEnrollment(
    userId: number,
    courseId: number,
    role: Student | Teacher,
  ): string {
    if (!this.userService.isValidId(userId))
      throw new BadRequestException('Invalid userId!');

    if (!this.courseService.isValidId(courseId))
      throw new BadRequestException('Invalid courseId!');

    if (
      role.localeCompare('student') !== 0 &&
      role.localeCompare('teacher') !== 0
    )
      throw new BadRequestException('Invalid role!');

    if (
      this.enrollments.some(
        (obj) =>
          obj.userId == userId && obj.courseId == courseId && obj.role == role,
      )
    ) {
      throw new BadRequestException('Enrollment Existed!');
    } else {
      this.enrollments.push({
        id: this.id++,
        userId: Number(userId),
        courseId: Number(courseId),
        role: role,
      });

      console.log(this.enrollments);
      return `New Enrollment added!`;
    }
  }

  deleteEnrollment(enrollmentId: number): string {
    if (this.isValidId(enrollmentId)) {
      const index = this.enrollments.findIndex(
        (obj) => obj.id === enrollmentId,
      );
      this.enrollments.splice(index, 1);

      console.log(this.enrollments);
      return `Enrollment with enrollmentId ${enrollmentId} deleted!`;
    } else {
      throw new BadRequestException('Invalid enrollmentId!');
    }
  }

  getEnrollment(enrollmentId: number): Enrollments {
    if (this.isValidId(enrollmentId))
      return this.enrollments.filter((obj) => obj.id === enrollmentId)[0];
    else throw new BadRequestException('Invalid enrollmentId!');
  }

  queryEnrollments(
    userId: number,
    courseId: number,
    role: Student | Teacher,
  ): Enrollments[] {
    const filter: { [key: string]: any } = {};

    // if userId not empty string or undefined, userId used as query parameter
    if (String(userId) !== '' && userId != undefined) {
      if (this.userService.isValidId(userId)) filter.userId = Number(userId);
      else throw new BadRequestException('Invalid userId!');
    }

    // if courseId not empty string or undefined, courseId used as query parameter
    if (String(courseId) !== '' && courseId != undefined) {
      if (this.courseService.isValidId(courseId))
        filter.courseId = Number(courseId);
      else throw new BadRequestException('Invalid courseid!');
    }

    // if role not empty string or undefined, role used as query parameter
    if (String(role) !== '' && role != undefined) {
      if (
        role.localeCompare('student') !== 0 &&
        role.localeCompare('teacher') !== 0
      )
        throw new BadRequestException('Invalid role!');
      else filter.role = role;
    }

    // extract enrollments which match the filters
    if (Object.keys(filter).length !== 0) {
      const retEnrollments: Enrollments[] = this.enrollments.filter((obj) => {
        return Object.keys(filter).every(
          (propName) => obj[propName] === filter[propName],
        );
      });

      return retEnrollments;
    } else {
      throw new BadRequestException('No query parameters provided!');
    }
  }

  queryUserCourse(userId: number): Courses[] {
    if (!this.userService.isValidId(userId))
      throw new BadRequestException('Invalid userId!');

    if (!this.enrollments.some((obj) => obj.userId === userId))
      throw new BadRequestException(`No enrollment with userId ${userId}!`);

    let courses: Courses[] = [];
    this.enrollments.forEach((obj) => {
      if (obj.userId === userId)
        courses.push(this.courseService.getCourse(obj.courseId));
    });
    courses.sort((a, b) => (b.id < a.id ? 1 : b.id > a.id ? -1 : 0));
    courses = courses.filter((obj, i) => i === courses.indexOf(obj));

    return courses;
  }

  isValidId(enrollmentId: number): boolean {
    return this.enrollments.some((obj) => obj.id === Number(enrollmentId));
  }
}

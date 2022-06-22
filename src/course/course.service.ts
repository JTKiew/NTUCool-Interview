import { BadRequestException, Injectable } from '@nestjs/common';
import { CourseData, Courses } from 'src/database';

@Injectable()
export class CourseService {
  // using provided fixed courses dataset
  // index courseId start from 0
  private courses: Courses[] = CourseData;

  getCourse(courseId: number): Courses {
    if (this.isValidId(courseId))
      return this.courses.filter((obj) => obj.id === courseId)[0];
    else throw new BadRequestException('Invalid courseId!');
  }

  isValidId(courseId: number): boolean {
    return this.courses.some((obj) => obj.id === Number(courseId));
  }
}

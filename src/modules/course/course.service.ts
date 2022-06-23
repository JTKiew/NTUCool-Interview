import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseData } from 'src/database';
import { Courses } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService implements OnModuleInit {
  async onModuleInit() {
    await this.coursesRepository.clear();
    await this.coursesRepository.save(CourseData);
  }
  @InjectRepository(Courses)
  private coursesRepository: Repository<Courses>;

  async getCourseById(courseId: number): Promise<Courses> {
    const course = await this.coursesRepository.findOneBy({ id: courseId });
    if (course) return course;
    else throw new BadRequestException('Invalid courseId!');
  }

  async isValidId(courseId: number): Promise<boolean> {
    // courseId might be string due to runtime, Number() to convert it
    const exist = await this.coursesRepository.findOneBy({
      id: Number(courseId),
    });
    return exist === null ? false : true;
  }
}

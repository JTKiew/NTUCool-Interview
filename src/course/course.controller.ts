import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Courses } from 'src/database';
import { CourseService } from './course.service';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  // get Course by courseId
  @Get(':courseId')
  get(@Param('courseId', ParseIntPipe) courseId: number): Courses {
    return this.courseService.getCourse(courseId);
  }
}

import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Courses } from 'src/entities';
import { CourseService } from './course.service';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  // get Course by courseId
  @Get(':courseId')
  get(@Param('courseId', ParseIntPipe) courseId: number): Promise<Courses> {
    return this.courseService.getCourseById(courseId);
  }
}

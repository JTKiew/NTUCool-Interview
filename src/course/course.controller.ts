import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
    constructor( private courseService: CourseService) {}

    // get Course by courseId
    @Get(':courseId')
    getCourse(@Param('courseId', ParseIntPipe) courseId: number){
        return this,this.courseService.getCourse(courseId);
    }
}

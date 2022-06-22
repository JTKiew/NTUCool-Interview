import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { addEnrollmentDto, queryEnrollCourseDto, queryEnrollmentDto, queryEnrollUserDto} from 'src/dto';
import { EnrollmentService } from './enrollment.service';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentController {
    constructor( private enrollService: EnrollmentService) {}

    // query Users by courseId
    @Get('/courses/:courseId/users')
    queryCourseUser(@Query() dto: queryEnrollUserDto){
        return this.enrollService.queryCourseUser(Number(dto.courseId));
    }

    @ApiBearerAuth()
    // create enrollment
    @Post()
    addEnrollment(@Body() dto: addEnrollmentDto){
        return this.enrollService.addEnroll(dto);
    }

    @ApiBearerAuth()
    // delete enrollment 
    @Delete(':id')
    deleteEnrollment(@Param('id', ParseIntPipe) id: number){
        return this.enrollService.deleteEnroll(id);
    }

    // get enrollment
    @Get(':id')
    getEnrollment(@Param('id', ParseIntPipe) id: number){
        return this.enrollService.getEnroll(id);
    }

    // query enrollment by userId, courseId and role
    @Get('enrollment')
    queryEnrollment(@Query() dto: queryEnrollmentDto){
        console.log({dto})
        return this.enrollService.queryEnroll(dto);
    }

    // query Courses by userId
    @Get('/users/:userId/courses')
    queryUserCourse(@Query() dto: queryEnrollCourseDto ){
        return this.enrollService.queryUserCourse(Number(dto.userId));
    }
}

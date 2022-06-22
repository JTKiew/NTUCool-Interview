import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { addEnrollmentDto, queryEnrollmentDto} from 'src/dto';
import { BearerAuthGuard } from 'src/guards/bearer-auth.guard.ts.guard';
import { EnrollmentService } from './enrollment.service';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentController {
    constructor( private enrollService: EnrollmentService) {}

    // query Users by courseId
    @Get('courses/:courseId/users')
    queryCourseUser(
        @Param('courseId', ParseIntPipe) courseId: number){
        return this.enrollService.queryCourseUser(courseId);
    }

    @ApiBearerAuth()
    // create enrollment
    @Post()
    @UseGuards(BearerAuthGuard)
    addEnrollment(@Body() dto: addEnrollmentDto){
        return this.enrollService.addEnroll(dto);
    }

    @ApiBearerAuth()
    // delete enrollment 
    @UseGuards(BearerAuthGuard)
    @Delete(':enrollmentId')
    deleteEnrollment(@Param('enrollmentId', ParseIntPipe) enrollmentId: number){
        return this.enrollService.deleteEnroll(enrollmentId);
    }

    // get enrollment
    @Get(':enrollmentId')
    getEnrollment(@Param('enrollmentId', ParseIntPipe) enrollmentId: number){
        return this.enrollService.getEnroll(enrollmentId);
    }

    // query enrollment by userId, courseId and role
    @Get()
    queryEnrollment(@Query() dto: queryEnrollmentDto){
        console.log({dto})
        return this.enrollService.queryEnroll(dto);
    }

    // query Courses by userId
    @Get('users/:userId/courses')
    queryUserCourse(@Param('userId', ParseIntPipe) userId: number){
        return this.enrollService.queryUserCourse(userId);
    }
}

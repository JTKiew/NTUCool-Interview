import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Courses, Enrollments, Users } from 'src/database';
import { AddEnrollmentDto, QueryEnrollmentDto } from 'src/dto';
import { BearerAuthGuard } from 'src/guards/bearer-auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';
import { Role } from 'src/roles/role';
import { Roles } from 'src/roles/roles.decorator';
import { EnrollmentService } from './enrollment.service';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentController {
  constructor(private enrollService: EnrollmentService) {}

  // query Users by courseId
  @Get('courses/:courseId/users')
  queryUser(@Param('courseId', ParseIntPipe) courseId: number): Users[] {
    return this.enrollService.queryCourseUsers(courseId);
  }

  @ApiBearerAuth()
  // create enrollment
  @Post()
  @Roles(Role.Admin)
  @UseGuards(BearerAuthGuard, RolesGuard)
  add(@Body() dto: AddEnrollmentDto): string {
    return this.enrollService.addEnrollment(dto.userId, dto.courseId, dto.role);
  }

  @ApiBearerAuth()
  // delete enrollment
  @Roles(Role.Admin)
  @UseGuards(BearerAuthGuard, RolesGuard)
  @Delete(':enrollmentId')
  delete(@Param('enrollmentId', ParseIntPipe) enrollmentId: number): string {
    return this.enrollService.deleteEnrollment(enrollmentId);
  }

  // get enrollment
  @Get(':enrollmentId')
  get(@Param('enrollmentId', ParseIntPipe) enrollmentId: number): Enrollments {
    return this.enrollService.getEnrollment(enrollmentId);
  }

  // query enrollment by userId, courseId and role
  @Get()
  queryEnrollment(@Query() dto: QueryEnrollmentDto): Enrollments[] {
    return this.enrollService.queryEnrollments(
      dto.userId,
      dto.courseId,
      dto.role,
    );
  }

  // query Courses by userId
  @Get('users/:userId/courses')
  queryCourse(@Param('userId', ParseIntPipe) userId: number): Courses[] {
    return this.enrollService.queryUserCourses(userId);
  }
}

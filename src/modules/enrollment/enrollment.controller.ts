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
import { AddEnrollmentDto, QueryEnrollmentDto } from 'src/dto';
import { Enrollments } from 'src/entities';
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
  queryUser(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<Enrollments[]> {
    return this.enrollService.queryCourseUsers(courseId);
  }

  @ApiBearerAuth()
  // create enrollment
  @Post()
  @Roles(Role.Admin)
  @UseGuards(BearerAuthGuard, RolesGuard)
  add(@Body() dto: AddEnrollmentDto): Promise<Enrollments> {
    return this.enrollService.addEnrollment(dto.userId, dto.courseId, dto.role);
  }

  @ApiBearerAuth()
  // delete enrollment
  @Roles(Role.Admin)
  @UseGuards(BearerAuthGuard, RolesGuard)
  @Delete(':enrollmentId')
  delete(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
  ): Promise<Enrollments> {
    return this.enrollService.deleteEnrollmentById(enrollmentId);
  }

  // get enrollment
  @Get(':enrollmentId')
  get(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
  ): Promise<Enrollments> {
    return this.enrollService.getEnrollmentById(enrollmentId);
  }

  // query enrollment by userId, courseId and role
  @Get()
  queryEnrollment(@Query() dto: QueryEnrollmentDto): Promise<Enrollments[]> {
    return this.enrollService.queryEnrollments(
      dto.userId,
      dto.courseId,
      dto.role,
    );
  }

  // query Courses by userId
  @Get('users/:userId/courses')
  queryCourse(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Enrollments[]> {
    return this.enrollService.queryUserCourses(userId);
  }
}

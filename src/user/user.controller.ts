import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Users } from 'src/database';
import { CreateUserDto, EditUserDto, QueryUserDto } from 'src/dto';
import { BearerAuthGuard } from 'src/guards/bearer-auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';
import { Role } from 'src/roles/role';
import { Roles } from 'src/roles/roles.decorator';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  // create User
  @Roles(Role.Admin)
  @UseGuards(BearerAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateUserDto): string {
    return this.userService.createUser(dto.username, dto.email);
  }

  // get User by userId
  @Get(':userId')
  get(@Param('userId', ParseIntPipe) userId: number): Users {
    return this.userService.getUser(userId);
  }

  // query User by name / email
  @Get()
  query(@Query() dto: QueryUserDto): Users {
    return this.userService.queryUser(dto.filter, dto.str);
  }

  @ApiBearerAuth()
  // edit User by userId
  @Roles(Role.Admin)
  @UseGuards(BearerAuthGuard, RolesGuard)
  @Put(':userId')
  edit(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
  ): string {
    return this.userService.editUser(userId, dto.username, dto.email);
  }

  @ApiBearerAuth()
  // delete User by userId
  @Roles(Role.Admin)
  @UseGuards(BearerAuthGuard, RolesGuard)
  @Delete(':userId')
  delete(@Param('userId', ParseIntPipe) userId: number): string {
    return this.userService.deleteUser(userId);
  }
}

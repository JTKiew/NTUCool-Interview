import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createUserDto, editUserDto, queryUserDto } from 'src/dto';
import { UserService } from './user.service';
 
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor( private userService: UserService) {}

    @ApiBearerAuth()
    // create User
    @Post()
    createUser(@Body() dto: createUserDto){
        return this.userService.createUser(dto);
    };

    // get User by userId
    @Get(':userId')
    getUser(@Param('userId', ParseIntPipe) userId: number){
        return this.userService.getUser(userId);
    }
    
    // query User by name / email
    @Get()
    queryUser(@Query() dto: queryUserDto){
        return this.userService.queryUser(dto);
    }
    
    @ApiBearerAuth()
    // edit User by userId
    @Put(':userId')
    edituser(
        @Param('userId', ParseIntPipe) userId: number, 
        @Body() dto: editUserDto){
        return this.userService.editUser(userId, dto);
    }

    @ApiBearerAuth()
    // delete User by userId
    @Delete(':userId')
    deleteUser(@Param('userId', ParseIntPipe) userId: number){
        return this.userService.deleteUser(userId);
    }
}

import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class addEnrollmentDto {
    @ApiProperty()
    @IsNotEmpty()   // ensure userId not empty string
    userId: number

    @ApiProperty()
    @IsNotEmpty()   // ensure courseId not empty string
    courseId: number    
    
    @ApiProperty()
    @IsNotEmpty()   // ensure role not empty string
    role: 'student' | 'teacher'
}
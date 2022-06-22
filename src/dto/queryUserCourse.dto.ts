import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class queryEnrollCourseDto {
    @ApiProperty()
    @IsNotEmpty()   // ensure userId not empty string
    userId: number
}
import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class queryEnrollUserDto {
    @ApiProperty()
    @IsNotEmpty()   // ensure courseId not empty string
    courseId: number
}
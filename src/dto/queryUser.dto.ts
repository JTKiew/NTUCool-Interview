import { IsNotEmpty, Matches, ValidateIf } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class queryUserDto {
    @ApiProperty()
    @IsNotEmpty()   // ensure filter not empty string
    filter: string

    @ApiProperty()
    @IsNotEmpty()   // ensure str not empty string
    @ValidateIf(obj => obj.filter === "email")  // validate if the str contain email addr
    @Matches('^[\\S]+@[\\S]+$')                 // must match given regex
    str: string
}
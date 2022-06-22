import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty() // ensure name not empty string
  username: string;

  @ApiProperty()
  @IsNotEmpty() // ensure email not empty string
  @Matches('^[\\S]+@[\\S]+$') // must match given regex
  email: string;
}

import { ValidateIf, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty()
  @ValidateIf((obj) => obj.name !== '') // blank if no change to name
  @IsOptional() // optional parameter
  username: string;

  @ApiProperty()
  @ValidateIf((obj) => obj.email !== '') // blank if no change to email
  @Matches('^[\\S]+@[\\S]+$') // must match given regex
  @IsOptional() // optional parameter
  email: string;
}

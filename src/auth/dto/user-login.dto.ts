import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UserLoginDto {
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*\d).{8,}$/)
  password: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

}

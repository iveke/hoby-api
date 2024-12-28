import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UserSignUpDto {
  @IsEmail()
  email: string;

  @MinLength(8, { message: 'password must be more than 8 symbols' })
  password: string;

  @IsOptional()
  birthDay: string;

  @IsOptional()
  phone: string;

@IsOptional()
name: string;
}

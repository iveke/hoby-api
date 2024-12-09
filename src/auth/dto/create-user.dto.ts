import { IsEmail, MinLength } from 'class-validator';

export class UserSignUpDto {
  @IsEmail()
  email: string;

  @MinLength(8, { message: 'password must be more than 8 symbols' })
  password: string;
}

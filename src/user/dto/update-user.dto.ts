import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email?: string;

  @IsOptional()
  birthDay?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

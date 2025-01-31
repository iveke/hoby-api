import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  // @IsOptional()
  // @IsEmail()
  // email?: string;

  @IsOptional()
  birthDay?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsString()
  name?: string;


  @IsOptional()
  file?: Express.Multer.File;
  // @IsOptional()
  // @IsString()
  // password?: string;
}

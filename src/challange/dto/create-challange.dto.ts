import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateChallangeDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsDate()
  deadline: Date;
}

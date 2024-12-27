import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateChallangeDto {
  @IsOptional()
  @IsString()
  text: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsDate()
  deadline: Date;
}

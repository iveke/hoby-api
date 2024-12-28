import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChallangeDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsOptional()
  deadline: Date;
}

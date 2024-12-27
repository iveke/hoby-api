import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  mark: number;
}

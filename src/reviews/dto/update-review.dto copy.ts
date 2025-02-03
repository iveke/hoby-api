import { IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  description: string;

}

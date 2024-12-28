import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HOBBY_TYPE } from '../enum/hobby-type.enum';

export class UpdateHobbyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(HOBBY_TYPE)
  type?: HOBBY_TYPE;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  neededThing?: string;

  @IsOptional()
  @IsString()
  interestFact?: string;
}

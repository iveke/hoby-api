import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HOBBY_TYPE } from '../enum/hobby-type.enum';
import { Type } from 'class-transformer';

export class FILTER_HOBBY {
  @IsString()
  @IsEnum(HOBBY_TYPE)
  @IsOptional()
    @Type(() => Number)
  type?: HOBBY_TYPE;
}

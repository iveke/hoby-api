import { IsEnum, IsString } from 'class-validator';
import { HOBBY_TYPE } from '../enum/hobby-type.enum';

export class FILTER_HOBBY {
  @IsString()
  @IsEnum(HOBBY_TYPE)
  type: HOBBY_TYPE;
}

import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../user.entity';

export const GetUser = createParamDecorator((data: string, context) => {
  const user: UserEntity = context.switchToHttp().getRequest().user;
  return data ? user && user[data] : user;
});

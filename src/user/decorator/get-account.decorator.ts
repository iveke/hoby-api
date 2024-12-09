import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../user.entity';

export const GetAccount = createParamDecorator((data: string, context) => {
  const userAccount: UserEntity = context
    .switchToHttp()
    .getRequest().userAccount;

  return data ? userAccount && userAccount[data] : userAccount;
});

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '../user.entity';
import { USER_ROLE } from '../enum/user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user }: { user: UserEntity } = request;

    if (!user) {
      return false;
    }

    const userRelation = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!userRelation) {
      return false;
    }

    const { role = null }: { role: USER_ROLE } = userRelation;

    if (role === null) {
      return false;
    }

    const roles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (roles) {
      const index = roles.indexOf(role);

      if (index === -1) {
        return false;
      }
    }

    request.userAccount = userRelation;

    return true;
  }
}

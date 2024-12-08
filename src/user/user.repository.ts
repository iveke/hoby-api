import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { AUTH_ERROR } from './enum/auth-error.enum';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { password, email } = createUserDto;

    const user: UserEntity = new UserEntity();

    user.password = await argon2.hash(password);

    user.email = email.toLowerCase();

    try {
      return await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(AUTH_ERROR.USER_ALREADY_EXISTS);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

import { UserEntity } from './user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { AUTH_ERROR } from '../auth/enum/auth-error.enum';
import { UserSignUpDto } from 'src/auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: UserSignUpDto): Promise<UserEntity> {
    const { password, email } = createUserDto;

    const isUserExist = this.repository.findOne({ where: { email: email } });

    if (isUserExist) {
      throw new BadRequestException(AUTH_ERROR.USER_ALREADY_EXISTS);
    }
    
    const user: UserEntity = new UserEntity();

    user.password = await argon2.hash(password);

    user.email = email.toLowerCase();

    try {
      return await this.repository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(AUTH_ERROR.USER_ALREADY_EXISTS);
      } else {
        console.log(error);
        throw new InternalServerErrorException('hello, boddy');
      }
    }
  }

  async FindUser(email: string) {
    return await this.repository.findOne({
      where: {
        email: email,
      },
    });
  }
}

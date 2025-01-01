import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(user: UserEntity) {
    const userData = await this.userRepository.FindUser(user.email);
    return { ...userData, password: undefined };
  }

  async updateUser(updateUserDto: UpdateUserDto, user: UserEntity) {
    return await this.userRepository.updateUser(user.id, updateUserDto);
  }
}

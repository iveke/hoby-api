import { Injectable, NotFoundException } from '@nestjs/common';
import { HobbyRepository } from './hobby.repository';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateHobbyDto } from './dto/update-hobby.dto';

@Injectable()
export class HobbyService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly hobbyRepository: HobbyRepository,
  ) {}

  async createHobby(createHobbyDto: CreateHobbyDto, creatorId: string) {
    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new NotFoundException(`User with id ${creatorId} not found`);
    }

    return await this.hobbyRepository.createHobby(createHobbyDto, creator);
  }

  async updateHobby(
    id: number,
    updateHobbyDto: UpdateHobbyDto,
    userId: string,
  ) {
    this.hobbyRepository.updateHobby(id, updateHobbyDto, userId);
  }

  addHobbyToUser(userId: string, hobbyId: number) {
    this.hobbyRepository.addHobbyToUser(userId, hobbyId);
  }

  async deleteHobby(id: number, user: UserEntity) {
    await this.hobbyRepository.deleteHobby(id, user);
    return { message: `Hobby with id ${id} has been deleted` };
  }
}

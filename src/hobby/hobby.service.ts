import { Injectable, NotFoundException } from '@nestjs/common';
import { HobbyRepository } from './hobby.repository';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import { FILTER_HOBBY } from './dto/filter-hobby.dto';

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
    return await this.hobbyRepository.updateHobby(id, updateHobbyDto, userId);
  }

  async addHobbyToUser(userId: string, hobbyId: number) {
    return await this.hobbyRepository.addHobbyToUser(userId, hobbyId);
  }

  async removeHobbyFromUser(userId: string, hobbyId: number) {
    return await this.hobbyRepository.removeHobbyFromUser(userId, hobbyId);
  }

  async getHobby(hobbyId: number) {
    return await this.hobbyRepository.getHobby(hobbyId);
  }

  async getHobbyList(userId: string, filterOption: FILTER_HOBBY) {
    return await this.hobbyRepository.getHobbyList(userId, filterOption);
  }

  async getHobbyListAdmin(filterOption?: string) {
    return await this.hobbyRepository.getHobbyListAdmin(Number(filterOption));
  }

  async deleteHobby(id: number, user: UserEntity) {
    await this.hobbyRepository.deleteHobby(id, user);
    return { message: `Hobby with id ${id} has been deleted` };
  }
}

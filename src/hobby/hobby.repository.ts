import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HobbyEntity } from './hobby.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class HobbyRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(HobbyEntity)
    private readonly repository: Repository<HobbyEntity>,
  ) {}

  async createHobby(createHobbyDto: CreateHobbyDto, creator: UserEntity) {
    const hobby = this.repository.create({
      ...createHobbyDto,
      creator,
    });

    return await this.repository.save(hobby);
  }

  async updateHobby(
    id: number,
    updateHobbyDto: UpdateHobbyDto,
    userId: string,
  ) {
    const hobby = await this.repository.findOne({
      where: { id },
      relations: ['creator'], // Завантажуємо інформацію про творця
    });
  
    if (!hobby) {
      throw new NotFoundException(`Hobby with id ${id} not found`);
    }
  
    if (hobby.creator.id !== userId) {
      throw new ForbiddenException('You are not allowed to edit this hobby');
    }
  
    Object.assign(hobby, updateHobbyDto); // Оновлюємо лише передані поля
    return this.repository.save(hobby); // Зберігаємо зміни
  }


  async addHobbyToUser(userId: string, hobbyId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['hobbies'],
    });
    const hobby = await this.repository.findOne({
      where: { id: hobbyId },
    });

    if (user && hobby) {
      user.hobbies.push(hobby); // Додаємо хобі до списку хобі користувача
      return await this.userRepository.save(user);
    }

    throw new Error('User or Hobby not found');
  }

  async deleteHobby(id: number, user: UserEntity) {
    const hobby = await this.repository.findOne({
      where: { id },
      relations: ['creator'], // Завантажуємо інформацію про творця
    });
  
    if (!hobby) {
      throw new NotFoundException(`Hobby with id ${id} not found`);
    }
  
    // Перевірка доступу: користувач має бути творцем або адміністратором
    if (hobby.creator.id !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to delete this hobby');
    }
  
    await this.repository.remove(hobby); // Видаляємо хобі
  }
}

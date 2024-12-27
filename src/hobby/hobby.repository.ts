import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HobbyEntity } from './hobby.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { USER_ROLE } from 'src/user/enum/user-role.enum';

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

  async removeHobbyFromUser(
    userId: string,
    hobbyId: number,
  ): Promise<UserEntity> {
    // Знайти користувача з його хобі
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['hobbies'], // Завантажуємо список хобі користувача
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Перевірка чи хобі існує
    const hobby = await this.repository.findOne({
      where: { id: hobbyId },
    });

    if (!hobby) {
      throw new Error('Hobby not found');
    }

    // Видалити хобі зі списку користувача
    user.hobbies = user.hobbies.filter((h) => h.id != hobbyId);

    // Зберегти оновленого користувача
    return await this.userRepository.save(user);
  }

  async getHobby(hobbyId: number) {
    const query = this.repository
      .createQueryBuilder('hobby')
      .leftJoinAndSelect('hobby.creator', 'creator')
      .leftJoin('hobby.users', 'user')
      .where('hobby.id = :hobbyId', { hobbyId })
      .select([
        'hobby.id',
        'hobby.createDate as createDate',
        'hobby.updateDate as updateDate',
        'hobby.name',
        'hobby.type',
        'hobby.description',
        'hobby.interestFact',
        'hobby.neededThing',
        'creator.name',
      ])
      .addSelect('COUNT(user.id)', 'userCount') // Підрахунок користувачів
      .groupBy('hobby.id') // Групування по хобі
      .addGroupBy('creator.name'); // У випадку використання SELECT на creator

    const hobby = await query.getRawOne();

    if (!hobby) {
      throw new BadRequestException('HOBBY_WITH_THAT_ID_NOT_EXIST');
    }
    console.log(hobby);

    return {
      id: hobby.hobby_id,
      createDate: hobby.hobby_createDate,
      updateDate: hobby.hobby_updateDate,
      name: hobby.hobby_name,
      type: hobby.hobyy_type,
      description: hobby.hobby_description,
      interestFact: hobby.hobby_interestFact,
      neededThing: hobby.hobby_neededThing,
      creatorName: hobby.creator_name,
      savedCount: parseInt(hobby.userCount, 10),
    };
    // return hobby;
  }

  async getHobbyList(userId: string) {
    const query = this.repository
      .createQueryBuilder('hobby')
      .innerJoin('hobby.users', 'users')
      .leftJoinAndSelect('hobby.creator', 'creator')
      .where('users.id = :userId', { userId })
      .select([
        'hobby.id',
        'hobby.createDate as createDate',
        'hobby.updateDate as updateDate',
        'hobby.name',
        'hobby.type',
        'hobby.description',
        'hobby.interestFact',
        'hobby.neededThing',
        'creator.name',
      ])
      .addSelect('COUNT(users.id)', 'userCount') // Підрахунок користувачів
      .groupBy('hobby.id') // Групування по хобі
      .addGroupBy('creator.name');

    console.log(query.getSql());

    const hobbyList = await query.getRawMany();

    console.log(hobbyList);

    return hobbyList.map((hobby) => {
      return {
        id: hobby.hobby_id,
        createDate: hobby.hobby_createDate,
        updateDate: hobby.hobby_updateDate,
        name: hobby.hobby_name,
        type: hobby.hobyy_type,
        description: hobby.hobby_description,
        interestFact: hobby.hobby_interestFact,
        neededThing: hobby.hobby_neededThing,
        creatorName: hobby.creator_name,
        savedCount: parseInt(hobby.userCount, 10),
      };
    });
    // return hobbyList;
  }

  async getHobbyListAdmin() {
    const query = this.repository
      .createQueryBuilder('hobby')
      .leftJoinAndSelect('hobby.users', 'users')
      .leftJoinAndSelect('hobby.creator', 'creator')
      .select([
        'hobby.id',
        'hobby.createDate as createDate',
        'hobby.updateDate as updateDate',
        'hobby.name',
        'hobby.type',
        'hobby.description',
        'hobby.interestFact',
        'hobby.neededThing',
        'creator.name',
        'creator.email',
        // 'hobby.users',
      ])
      .addSelect('COUNT(users.id)', 'userCount') // Підрахунок користувачів
      .groupBy('hobby.id') // Групування по хобі
      .addGroupBy('creator.name');

    const hobbyList = await query.getRawMany();

    console.log(hobbyList);
    return hobbyList.map((hobby) => {
      return {
        id: hobby.hobby_id,
        createDate: hobby.hobby_createDate,
        updateDate: hobby.hobby_updateDate,
        name: hobby.hobby_name,
        type: hobby.hobyy_type,
        description: hobby.hobby_description,
        interestFact: hobby.hobby_interestFact,
        neededThing: hobby.hobby_neededThing,
        creatorName: hobby.creator_name,
        creatorEmail: hobby.creator_email,
        savedCount: parseInt(hobby.userCount, 10),
      };
    });
    // return hobbyList;
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
    if (hobby.creator.id !== user.id && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('You are not allowed to delete this hobby');
    }

    await this.repository.remove(hobby); // Видаляємо хобі
  }
}

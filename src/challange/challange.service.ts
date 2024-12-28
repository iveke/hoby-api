import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChallangeEntity } from './challange.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateChallangeDto } from './dto/create-challange.dto';
import { UserEntity } from 'src/user/user.entity';
import { UpdateChallangeDto } from './dto/update-challange.dto';
import { USER_ROLE } from 'src/user/enum/user-role.enum';

@Injectable()
export class ChallangeServie {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ChallangeEntity)
    private readonly repository: Repository<ChallangeEntity>,
  ) {}

  async createChallange(
    createChallangeDto: CreateChallangeDto,
    creator: UserEntity,
  ) {
    const challange = this.repository.create({
      ...createChallangeDto,
      creator,
    });
    await this.repository.save(challange);
    return { ...challange, creator: undefined };
  }

  async updateChallange(
    id: number,
    updateChallangeDto: UpdateChallangeDto,
    user: UserEntity,
  ) {
    const challange = await this.repository.findOne({
      where: { id },
      relations: ['creator'], // Завантажуємо інформацію про творця
    });

    if (!challange) {
      throw new NotFoundException(`Challange with id:${id} not found`);
    }

    if (challange.creator.id !== user.id && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to edit this challange',
      );
    }

    Object.assign(challange, updateChallangeDto); // Оновлюємо лише передані поля
    await this.repository.save(challange);
    return { ...challange, creator: undefined }; // Зберігаємо зміни
  }

  async completeChallangeForUser(
    challangeId: number,
    user: UserEntity,
    status: boolean,
  ) {
    const challenge = await this.repository.findOne({
      where: { id: challangeId },
      relations: ['creator'],
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    // Перевірка, чи є вже запис для цього користувача
    if (!challenge.userStatuses[user.id]) {
      // Якщо запису немає, створюємо новий
      challenge.userStatuses[user.id] = {
        isCompleted: status, // Встановлюємо початковий статус
        completionDate: status ? new Date() : null, // Дата завершення залежить від статусу
      };
    } else {
      // Якщо запис вже існує, оновлюємо статус
      challenge.userStatuses[user.id] = {
        isCompleted: status,
        completionDate: status ? new Date() : null,
      };
    }

    // Зберігаємо зміни
    const formattedChallange = await this.repository.save(challenge);
    console.log(formattedChallange);
    return {
      ...formattedChallange,
      creator: {
        name: formattedChallange.creator.name,
        email: formattedChallange.creator.email,
      },
      userStatuses: undefined, // Не повертаємо userStatuses
      isCompleted: formattedChallange.userStatuses[user.id]?.isCompleted,
    };
  }

  async getCompletedChallangeList(userId: string) {
    const query = await this.repository
      .createQueryBuilder('challange')
      .leftJoinAndSelect('challange.creator', 'creator')
      .where(`challange.userStatuses::jsonb -> :userId IS NOT NULL`, { userId })
      .andWhere(
        `challange.userStatuses::jsonb -> :userId ->> 'isCompleted' = 'true'`,
        { userId },
      );

    const challagneList = await query.getMany();

    return challagneList.map((challange) => {
      return {
        ...challange,
        creator: {
          name: challange.creator.name,
          email: challange.creator.email,
        },
        userStatuses: undefined,
        isCompleted: true,
      };
    });
  }

  async getChallangeList(user: UserEntity, filterDate?: Date) {
    const today = new Date();

    const query = this.repository
      .createQueryBuilder('challange')
      .leftJoinAndSelect('challange.creator', 'creator')
      .orderBy(
        `CASE WHEN creator.id = :userId THEN 0 ELSE 1 END`, // Спочатку челенджі, створені користувачем
        'ASC',
      )
      .setParameter('userId', user.id)
      .andWhere(
        new Brackets((qb) => {
          qb.where('challange.deadline IS NULL') // Додаємо челенджі з null у deadline
            .orWhere('DATE(challange.deadline) > DATE(:today)', { today }); // Дата має бути більшою або рівною
        }),
      );

    if (filterDate) {
      query.andWhere('DATE(challange.deadline) = DATE(:filterDate)', {
        filterDate,
      });
    }

    const challangeList = await query.getMany();

    console.log(challangeList);
    // const challangeList = await query.getMany();

    // Форматуємо список, додаючи поле `isCompleted`
    const formattedList = challangeList.map((challange) => {
      // Отримуємо статус користувача з `userStatuses`
      const userStatus = challange?.userStatuses?.[user.id];

      return {
        ...challange, // Копіюємо всі дані про челендж
        isCompleted: userStatus?.isCompleted || false,
        userStatuses: undefined,
        creator: {
          name: challange.creator.name,
          email: challange.creator.email,
        }, // Додаємо нове поле
      };
    });

    return formattedList;
  }

  async getChallangeOtherList(user: UserEntity) {
    const today = new Date();

    const query = this.repository
      .createQueryBuilder('challange')
      .leftJoinAndSelect('challange.creator', 'creator')
      .where('creator.id != :userId', { userId: user.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('challange.deadline IS NULL') // Додаємо челенджі з null у deadline
            .orWhere('DATE(challange.deadline) > DATE(:today)', { today }); // Дата має бути більшою або рівною
        }),
      );

    const challangeList = await query.getMany();

    console.log(challangeList);

    // Форматуємо список, додаючи поле `isCompleted`
    const formattedList = challangeList.map((challange) => {
      // Отримуємо статус користувача з `userStatuses`
      const userStatus = challange?.userStatuses?.[user.id];

      return {
        ...challange, // Копіюємо всі дані про челендж
        isCompleted: userStatus?.isCompleted || false,
        userStatuses: undefined,
        creator: {
          name: challange.creator.name,
          email: challange.creator.email,
        }, // Додаємо нове поле
      };
    });

    return formattedList;
  }

  async deleteChallange(user: UserEntity, challangeId: number) {
    // Знаходимо челендж за ID
    const challange = await this.repository.findOne({
      where: { id: challangeId },
      relations: ['creator'], // Завантажуємо інформацію про творця
    });

    // Якщо челендж не знайдено, кидаємо помилку
    if (!challange) {
      throw new NotFoundException('Challange not found');
    }

    // Перевіряємо, чи користувач має права на видалення
    const isCreator = challange.creator.id === user.id; // Перевірка, чи це творець
    const isAdmin = user.role === USER_ROLE.ADMIN; // Перевірка ролі

    if (!isCreator && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this challange',
      );
    }

    // Видаляємо челендж
    await this.repository.delete({ id: challangeId });

    return 'Challange successfully deleted';
  }
}

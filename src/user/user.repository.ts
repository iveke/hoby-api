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
import { format } from 'date-fns';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: UserSignUpDto): Promise<UserEntity> {
    const { password, email, phone, birthDay, name } = createUserDto;

    const isUserExist = await this.repository.findOne({
      where: { email: email },
    });

    if (isUserExist) {
      throw new BadRequestException(AUTH_ERROR.USER_ALREADY_EXISTS);
    }

    const user: UserEntity = new UserEntity();

    user.password = await argon2.hash(password);

    user.email = email.toLowerCase();

    if (phone) {
      user.phone = phone;
    }

    if (birthDay) {
      console.log(birthDay);
      // Парсимо дату у форматі день/місяць/рік
      const [day, month, year] = birthDay.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      console.log(date);
      // const birthDayDate = parse(birthDay, 'dd/MM/yyyy');
      const birthDayDate = format(date, 'dd/MM/yyyy');
      console.log(birthDayDate);
      // console.log(birthDayDate);
      // if (isNaN(birthDayDate.getTime())) {
      //   throw new Error('Invalid date format');
      // }

      // Нормалізуємо час до початку доби (локальний час)
      // console.log(startOfDay(birthDay));
      user.birthDay = date;
    }
    // if (birthDay) {
    //   console.log(birthDay);
    //   // Розділяємо дату на частини

    //   // Створюємо об'єкт дати в локальному часі, гарантуючи початок доби
    //   console.log(day, month, year);
    //   const birthDayDate = new Date(birthDay);
    //   console.log(birthDayDate);
    //   if (isNaN(birthDayDate.getTime())) {
    //     throw new Error('Invalid date format');
    //   }

    //   console.log(birthDayDate); // Перевірка результату
    //   user.birthDay = birthDayDate;
    // }

    if (name) {
      user.name = name;
    }

    try {
      return await this.repository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(AUTH_ERROR.USER_ALREADY_EXISTS);
      } else {
        console.log(error);
        throw new InternalServerErrorException(error.message);
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

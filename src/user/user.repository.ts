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
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadService } from './upload-file.service';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly uploadService: UploadService,
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

      user.birthDay = date;
    }

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

  async updateUser(
    userID: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    const user = await this.repository.findOne({
      where: [{ id: userID }],
    });

    const { phone, name, birthDay } = updateUserDto;

    // if (email) {
    //   user.email = email.toLowerCase();
    // }

    // if (password) {
    //   user.updatePassword(password);
    // }
    let fileUrl = null;
    if (file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Недопустимий формат файлу');
      }
      fileUrl = await this.uploadService.uploadFile(file, user.id);
      user.photo = fileUrl;
    }

    if (name) {
      user.name = name;
    }

    if (phone) {
      user.phone = phone;
    }

    if (birthDay) {
      const [day, month, year] = birthDay.split('/').map(Number);
      const date = new Date(year, month - 1, day);

      user.birthDay = date;
    }

    await this.repository.save(user);

    return { ...user, password: undefined };
  }

  async FindUser(email: string) {
    return await this.repository.findOne({
      where: {
        email: email,
      },
    });
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from './guard/account.guard';
import { UserEntity } from './user.entity';
import { GetAccount } from './decorator/get-account.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload-file.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,

    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async getUser(@GetAccount() user: UserEntity) {
    return await this.userService.getUser(user);
  }

  @Patch('/update')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetAccount() user: UserEntity,
  ) {
    return await this.userService.updateUser(updateUserDto, user);
  }

  @Post('/photo')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @GetAccount() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не передано');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Недопустимий формат файлу');
    }

    const fileUrl = await this.uploadService.uploadFile(file, user.id);
    return {
      message: 'Фото успішно завантажено',
      url: fileUrl,
    };
  }

  @Delete('/photo')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async deletePhoto(@GetAccount() user: UserEntity) {
    await this.uploadService.removePhoto(user.id);
    return {
      message: 'Фото успішно видалено',
    };
  }
}

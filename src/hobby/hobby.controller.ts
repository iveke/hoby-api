import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { GetAccount } from 'src/user/decorator/get-account.decorator';
import { UserEntity } from 'src/user/user.entity';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import { Roles } from 'src/user/decorator/role.decorator';
import { USER_ROLE } from 'src/user/enum/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from 'src/user/guard/account.guard';

@Controller('hobby')
export class HobbyController {
  constructor(private readonly hobbyService: HobbyService) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async createHobby(
    @Body(ValidationPipe) createHobbyDto: CreateHobbyDto,
    @GetAccount() user: UserEntity,
  ) {
    return await this.hobbyService.createHobby(createHobbyDto, user.id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async updateHobby(
    @Param('id') id: number,
    @Body(ValidationPipe) updateHobbyDto: UpdateHobbyDto,
    @GetAccount() user: UserEntity, // Отримуємо інформацію про користувача з токена
  ) {
    return await this.hobbyService.updateHobby(id, updateHobbyDto, user.id);
  }

  @Post('join/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async addHobbyToUser(@Param('id') hobbyId: number, @GetAccount() user: UserEntity) {
    return await this.hobbyService.addHobbyToUser(user.id, hobbyId);
  }

  @Post('left/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async removeHobbyFromUser(@Param('id') hobbyId: number, @GetAccount() user: UserEntity) {
    return await this.hobbyService.removeHobbyFromUser(user.id, hobbyId);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async getHobby(@Param('id') hobbyId: number) {
    return await this.hobbyService.getHobby(hobbyId);
  }

  @Get('user/list')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async getHobbyList(@GetAccount() user: UserEntity) {
    console.log('hello');
    return await this.hobbyService.getHobbyList(user.id);
  }

  @Get('/admin/list')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  @Roles(USER_ROLE.ADMIN)
  async getHobbyListAdmin() {
    return await this.hobbyService.getHobbyListAdmin();
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.USER) // Дозволяємо доступ для адміністратора та звичайного користувача
  async deleteHobby(@Param('id') id: number, @GetAccount() user: UserEntity) {
    return await this.hobbyService.deleteHobby(id, user);
  }
}

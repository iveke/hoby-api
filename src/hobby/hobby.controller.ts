import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { GetAccount } from 'src/user/decorator/get-account.decorator';
import { UserEntity } from 'src/user/user.entity';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import { Roles } from 'src/user/decorator/role.decorator';
import { USER_ROLE } from 'src/user/enum/user-role.enum';

@Controller('hobby')
export class HobbyController {
  constructor(private readonly hobbyService: HobbyService) {}

  @Post('/create')
  //   @UseGuards(AuthGuard())
  createHobby(
    @Body(ValidationPipe) createHobbyDto: CreateHobbyDto,
    @GetAccount() user: UserEntity,
  ) {
    return this.hobbyService.createHobby(createHobbyDto, user.id);
  }

  @Patch('/update/:id')
  updateHobby(
    @Param('id') id: number,
    @Body(ValidationPipe) updateHobbyDto: UpdateHobbyDto,
    @GetAccount() user: UserEntity, // Отримуємо інформацію про користувача з токена
  ) {
    return this.hobbyService.updateHobby(id, updateHobbyDto, user.id);
  }

  @Patch()
  addHobbyToUser(
    @Param('hobbyID') hobbyId: number,
    @GetAccount() user: UserEntity,
  ) {
    this.hobbyService.addHobbyToUser(user.id, hobbyId);
  }

  @Delete('/delete/:id')
  @Roles(USER_ROLE.ADMIN, USER_ROLE.USER) // Дозволяємо доступ для адміністратора та звичайного користувача
  deleteHobby(@Param('id') id: number, @GetAccount() user: UserEntity) {
    return this.hobbyService.deleteHobby(id, user);
  }
}

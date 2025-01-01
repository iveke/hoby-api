import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from './guard/account.guard';
import { UserEntity } from './user.entity';
import { GetAccount } from './decorator/get-account.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}

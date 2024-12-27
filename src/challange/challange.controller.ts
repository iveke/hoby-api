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
import { ChallangeServie } from './challange.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from 'src/user/guard/account.guard';
import { GetAccount } from 'src/user/decorator/get-account.decorator';
import { UserEntity } from 'src/user/user.entity';
import { CreateChallangeDto } from './dto/create-challange.dto';
import { UpdateChallangeDto } from './dto/update-challange.dto';

@Controller('challange')
export class ChallangeController {
  constructor(private readonly challangeService: ChallangeServie) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async createChallange(
    @Body(ValidationPipe) createChallangeDto: CreateChallangeDto,
    @GetAccount() user: UserEntity,
  ) {
    return await this.challangeService.createChallange(
      createChallangeDto,
      user,
    );
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async updateHobby(
    @Param('id') id: number,
    @Body(ValidationPipe) updateChallangeDto: UpdateChallangeDto,
    @GetAccount() user: UserEntity, // Отримуємо інформацію про користувача з токена
  ) {
    return await this.challangeService.updateChallange(
      id,
      updateChallangeDto,
      user,
    );
  }

  @Post('update/status/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async addHobbyToUser(
    @Param('id') hobbyId: number,
    @Body(ValidationPipe) body: { status: boolean },
    @GetAccount() user: UserEntity,
  ) {
    console.log(body.status);
    return await this.challangeService.completeChallangeForUser(
      hobbyId,
      user,
      body.status,
    );
  }

  @Get('/list/your')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async getChallangeYourList(@GetAccount() user: UserEntity) {
    return await this.challangeService.getChallangeList(user);
  }
  @Get('/list/other')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async getChallangeUserList(@GetAccount() user: UserEntity) {
    return await this.challangeService.getChallangeOtherList(user);
  }

  @Get('/list')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async getCompletedChallangeList(@GetAccount() user: UserEntity) {
    return await this.challangeService.getCompletedChallangeList(user.id);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async deleteChallange(
    @Param('id') id: number,
    @GetAccount() user: UserEntity,
  ) {
    return await this.challangeService.deleteChallange(user, id);
  }
}

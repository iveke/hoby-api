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
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from 'src/user/guard/account.guard';
import { GetAccount } from 'src/user/decorator/get-account.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserEntity } from 'src/user/user.entity';
import { UpdateReviewDto } from './dto/update-review.dto copy';

@Controller('review')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async createReview(
    @Body(ValidationPipe) createReviewDto: CreateReviewDto,
    @GetAccount() user: UserEntity,
  ) {
    console.log(createReviewDto);
    return await this.reviewsService.createReview(createReviewDto, user);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async updateReview(
    @Param('id') id: number,
    @Body(ValidationPipe) updateReviewDto: UpdateReviewDto,
    @GetAccount() user: UserEntity, // Отримуємо інформацію про користувача з токена
  ) {
    return await this.reviewsService.updateReview(id, updateReviewDto, user.id);
  }

  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  async getReviewList() {
    return await this.reviewsService.getReviewList();
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async deleteReview(@Param('id') id: number, @GetAccount() user: UserEntity) {
    return this.reviewsService.deleteReview(id, user);
  }
}

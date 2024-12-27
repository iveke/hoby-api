import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReviewsEntity } from './reviews.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto copy';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsEntity)
    private readonly repository: Repository<ReviewsEntity>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto, creator: UserEntity) {
    const review = this.repository.create({ ...createReviewDto, creator });

    console.log(review);

    if (!creator || !createReviewDto.mark) {
      throw new Error('Invalid data: Missing creator or mark');
    }

    return await this.repository.save(review);
  }
  async updateReview(
    id: number,
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ) {
    const review = await this.repository.findOne({
      where: { id },
      relations: ['creator'], // Завантажуємо інформацію про творця
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    if (review.creator.id !== userId) {
      throw new ForbiddenException('You are not allowed to edit this review');
    }

    Object.assign(review, updateReviewDto); // Оновлюємо лише передані поля
    return this.repository.save(review); // Зберігаємо зміни
  }

  async getReviewList() {
    const query = this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.creator', 'creator')
      .select([
        'review.id',
        'review.createDate',
        'review.updateDate',
        'review.description',
        'review.mark',
        'creator.name',
        'creator.email',
      ])
      .orderBy('review.createDate', 'DESC');

    return await query.getMany();
  }

  async deleteReview(id: number, user: UserEntity) {
    const review = await this.repository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    if (review.creator.id !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this hobby');
    }

    await this.repository.remove(review);
    return { message: `Review with id ${id} has been deleted` };
  }
}

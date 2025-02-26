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

    if (!creator) {
      throw new Error('Invalid data: Missing creator');
    }

    await this.repository.save(review);
    return {
      ...review,
      creator: {
        ...creator,
        password: undefined,
      },
    };
  }
  async updateReview(
    id: number,
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ) {
    const review = await this.repository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    if (review.creator.id !== userId) {
      throw new ForbiddenException('You are not allowed to edit this review');
    }

    Object.assign(review, updateReviewDto);
    await this.repository.save(review);
    return {
      ...review,
      creator: {
        name: review.creator.name,
        email: review.creator.email,
      },
    };
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
        'creator.name',
        'creator.email',
        'creator.photo',
        'creator.phone',
        'creator.birthDay',
        'creator.role',
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

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { HobbyEntity } from '../hobby.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HobbyOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(HobbyEntity)
    private readonly hobbyRepository: Repository<HobbyEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // отримуємо користувача з токена
    const hobbyId = request.params.id; // отримуємо ID хобі з параметрів

    const hobby = await this.hobbyRepository.findOne({
      where: { id: hobbyId },
      relations: ['creator'], // завантажуємо творця
    });

    if (!hobby) {
      throw new ForbiddenException('Hobby not found');
    }

    if (hobby.creator.id !== user.id) {
      throw new ForbiddenException('You are not allowed to edit this hobby');
    }

    return true; // дозвіл, якщо користувач є творцем
  }
}

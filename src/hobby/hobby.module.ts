import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { HobbyEntity } from './hobby.entity';
import { HobbyRepository } from './hobby.repository';
import { HobbyController } from './hobby.controller';
import { HobbyService } from './hobby.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, HobbyEntity, HobbyRepository]),
  ],
  controllers: [HobbyController],
  providers: [HobbyService, HobbyRepository],
  exports: [HobbyService, HobbyRepository],
})
export class HobbyModule {}

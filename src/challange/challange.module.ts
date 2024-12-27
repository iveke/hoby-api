import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ChallangeController } from './challange.controller';
import { ChallangeEntity } from './challange.entity';
import { ChallangeServie } from './challange.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChallangeEntity]),
  ],
  controllers: [ChallangeController],
  providers: [ChallangeServie],
  exports: [ChallangeServie],
})
export class ChallangeModule {}

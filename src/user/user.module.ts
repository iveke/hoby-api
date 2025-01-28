import { forwardRef, Module } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './user.repository';
import { UploadService } from './upload-file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UploadService],
  exports: [TypeOrmModule, UserRepository, UserService, UploadService],
})
export class UserModule {}

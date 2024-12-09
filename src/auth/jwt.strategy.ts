import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserEntity } from '../user/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AUTH_ERROR } from './enum/auth-error.enum';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly AuthRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_PRIVATE,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { id } = payload;
    const user = await this.AuthRepository.findOne({
      id,
    } as FindOneOptions<UserEntity>);

    if (user === undefined) {
      throw new UnauthorizedException(AUTH_ERROR.UNAUTHORIZED);
    } else {
      return user;
    }
  }
}

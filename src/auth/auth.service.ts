import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { UserSignUpDto } from './dto/create-user.dto';
import { LoginInfoDto } from './dto/login-info.dto';
import { UserEntity } from 'src/user/user.entity';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { AUTH_ERROR } from './enum/auth-error.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<LoginInfoDto> {
    const user: UserEntity = await this.userRepository.createUser({
      ...userSignUpDto,
    });

    const accessToken = await this.createJwt(user);

    return { accessToken };
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginInfoDto> {
    const { email, password } = userLoginDto;

    let user;
    if (email) {
      user = await this.userRepository.FindUser(email);
    }
    if (!user) {
      throw new BadRequestException(AUTH_ERROR.COULDNT_FOUND_USER);
    } else {
      const passwordCorrect = await user.validatePassword(password);

      if (passwordCorrect === false) {
        throw new BadRequestException(AUTH_ERROR.UNCORRECT_PASSWORD_OR_LOGIN);
      }
    }

    const accessToken = await this.createJwt(user);

    const loginInfo: LoginInfoDto = { accessToken };
    return loginInfo;
  }

  async updateLogin(user: UserEntity): Promise<LoginInfoDto> {
    const accessToken = await this.createJwt(user);

    return { accessToken };
  }

  async createJwt(user: UserEntity): Promise<string> {
    const { id, email, role } = user;

    const payload: JwtPayload = {
      id,
      email,
      role,
    };

    return this.jwtService.sign(payload);
  }
}

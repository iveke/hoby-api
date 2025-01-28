import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { UserSignUpDto } from './dto/create-user.dto';
import { LoginInfoDto } from './dto/login-info.dto';
import { UserEntity } from 'src/user/user.entity';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { AUTH_ERROR } from './enum/auth-error.enum';
import { UploadService } from 'src/user/upload-file.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly uploadService: UploadService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto, file: Express.Multer.File) {
    const user: UserEntity = await this.userRepository.createUser({
      ...userSignUpDto,
    });

    const fileUrl = await this.uploadService.uploadFile(file, user.id);

    const accessToken = await this.createJwt(user);

    return {
      accessToken,
      user: { ...user, photo: fileUrl, password: undefined },
    };
  }

  async login(userLoginDto: UserLoginDto) {
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

    // const loginInfo: LoginInfoDto = { accessToken };
    return { accessToken, user: { ...user, password: undefined } };
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

import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/create-user.dto';
import { LoginInfoDto } from './dto/login-info.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from 'src/user/decorator/get-account.decorator';
import { UserEntity } from 'src/user/user.entity';
import { AccountGuard } from 'src/user/guard/account.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UseInterceptors(FileInterceptor('file'))
  async signUp(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) userSignUpDto: UserSignUpDto,
  ) {
    return await this.authService.signUp(userSignUpDto, file);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto);
  }

  @Get('/token')
  @UseGuards(AuthGuard(), AccountGuard)
  async checkToken(@GetAccount() account: UserEntity): Promise<LoginInfoDto> {
    return await this.authService.updateLogin(account);
  }
}

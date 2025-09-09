import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() logindto: LoginDto) {
    return this.authService.login(logindto);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() registerdto: RegisterDto,
    @Body('confirmPassword') confirmPassword: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.authService.userRegister(registerdto, confirmPassword, avatar);
  }
}

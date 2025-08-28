import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    async login(@Body() logindto : LoginDto) {
        return this.authService.login(logindto);
    }
}

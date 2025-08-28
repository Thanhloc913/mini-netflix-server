import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountService } from '../accounts/account.service';
import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.accountService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(logindto : LoginDto) {
    const user = await this.validateUser(logindto.email, logindto.password);

    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload,{ expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload,{ expiresIn: '7d' });

    return {
      access_token,
      refresh_token
    };
  }
}

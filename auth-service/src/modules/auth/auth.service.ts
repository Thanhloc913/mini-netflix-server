import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountService } from '../accounts/account.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { AccountRole } from '../accounts/account-role.enum';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.accountService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(logindto: LoginDto) {
    const user = await this.validateUser(logindto.email, logindto.password);

    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token,
      refresh_token
    };
  }

  async userRegister(registerdto: RegisterDto, confirmPassword: string, avatar?: Express.Multer.File) {
    if (!registerdto.email) {
      throw new BadRequestException('Email is required');
    }

    if (!registerdto.password) {
      throw new BadRequestException('Password is required');
    }

    if (!confirmPassword) {
      throw new BadRequestException('Confirm Password is required');
    }

    if (registerdto.password !== confirmPassword) {
      throw new UnauthorizedException('Password and Confirm Password do not match');
    }

    const existingUser = await this.accountService.findByEmail(registerdto.email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(registerdto.password, 10);
    const user = await this.accountService.createUser({
      email: registerdto.email,
      password: hashedPassword,
      role: AccountRole.USER,
    });

    const accountId = user.id;

    if (!accountId) {
      throw new BadRequestException('Account ID is required to create profile');
    } else {
      await this.profileService.createProfile({ accountId, name: registerdto.name }, avatar);
    }
    return { message: 'User registered successfully' };
  }
}

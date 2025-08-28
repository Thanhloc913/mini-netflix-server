import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profiles } from './profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/account.entity';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  imports: [TypeOrmModule.forFeature([Profiles, Account])],
})
export class ProfileModule {}

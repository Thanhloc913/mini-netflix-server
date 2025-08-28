import { BadRequestException, Get, Injectable, Post } from '@nestjs/common';
import { Profiles } from './profile.entity';
import { Repository } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { CreateProfileDto } from './profile.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profiles)
        private readonly profileRepository: Repository<Profiles>,
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
    ) { }

    getProfile() {
        return this.profileRepository.find();
    }

    getProfileById(id: string) {
        return this.profileRepository.findOne({
            where: { id },
            relations: ['accountId'], // load luôn quan hệ Account
        });
    }

    getProfileByAccountId(accountId: string) {
        return this.profileRepository.findOne({
            where: { accountId: { id: accountId } }
        });
    }

    async createProfile(profile: CreateProfileDto) {
        if (!profile.name || !profile.accountId) {
            throw new BadRequestException('Tên và accountId không được để trống');
        }

        const existingAccount = await this.accountRepository.findOne({
            where: { id: profile.accountId }
        });
        if (!existingAccount) {
            throw new BadRequestException('Tài khoản không tồn tại');
        }
        const newProfile = this.profileRepository.create({
            name: profile.name,
            avatarUrl: profile.avatarUrl,
            accountId: existingAccount,
        });
        return this.profileRepository.save(newProfile);
    }
}

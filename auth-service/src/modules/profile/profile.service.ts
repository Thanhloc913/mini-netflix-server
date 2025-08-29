import { BadRequestException, Get, Injectable, Post } from '@nestjs/common';
import { Profiles } from './profile.entity';
import { Repository } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
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

    async updateProfile(id: string, updateDTO: UpdateProfileDto) {
        const profile = await this.profileRepository.findOne({ where: { id } });

        if (!profile) {
            throw new BadRequestException('Hồ sơ không tồn tại');
        }

        if (updateDTO.name == null || updateDTO.name === undefined) {
            throw new BadRequestException('Tên không được để trống');
        }

        profile.name = updateDTO.name;
        profile.avatarUrl = updateDTO.avatarUrl;

        return this.profileRepository.save(profile);
    }

    async deleteProfile(id: string) {
        const profile = await this.profileRepository.findOne({ where: { id } });

        if (!profile) {
            throw new BadRequestException('Hồ sơ không tồn tại');
        }
        return this.profileRepository.softDelete(id);
    }
}

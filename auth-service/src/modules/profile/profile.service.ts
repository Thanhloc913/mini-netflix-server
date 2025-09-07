import { BadRequestException, Get, Inject, Injectable, Post } from '@nestjs/common';
import { Profiles } from './profile.entity';
import { Repository } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileClientService } from '../../common/clients/file-client.service';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profiles)
        private readonly profileRepository: Repository<Profiles>,
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        private readonly fileClient: FileClientService,
    ) { }

    getProfile() {
        return this.profileRepository.find();
    }

    getProfileById(id: string) {
        return this.profileRepository.findOne({
            where: { id },
            relations: ['accountId'],
        });
    }

    getProfileByAccountId(accountId: string) {
        return this.profileRepository.findOne({
            where: { accountId: { id: accountId } }
        });
    }

    async createProfile(dto: CreateProfileDto, avatar?: Express.Multer.File) {
        let avatarUrl: string | undefined;

        if (avatar) {
            avatarUrl = await this.fileClient.uploadAvatar(avatar.buffer);
        }

        const account = await this.accountRepository.findOne({
            where: { id: dto.accountId },
        });
        if (!account) {
            throw new BadRequestException('Tài khoản không tồn tại');
        }

        const profile = this.profileRepository.create({
            name: dto.name,
            avatarUrl,
            accountId: account,
        });

        return this.profileRepository.save(profile);
    }

    async updateProfile(id: string, updateDTO: UpdateProfileDto, avatar?: Express.Multer.File) {
        const profile = await this.profileRepository.findOne({ where: { id } });
        if (!profile) {
            throw new BadRequestException('Hồ sơ không tồn tại');
        }

        const updateData: Partial<typeof profile> = {};

        if (updateDTO.name) {
            updateData.name = updateDTO.name;
        }

        if (avatar) {
            updateData.avatarUrl = await this.fileClient.uploadAvatar(avatar.buffer);
        }

        await this.profileRepository.update(id, updateData);

        return this.profileRepository.findOne({ where: { id } });
    }


    async deleteProfile(id: string) {
        const profile = await this.profileRepository.findOne({ where: { id } });

        if (!profile) {
            throw new BadRequestException('Hồ sơ không tồn tại');
        }
        return this.profileRepository.softDelete(id);
    }
}

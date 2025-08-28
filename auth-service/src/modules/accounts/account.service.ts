import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto, UpdateAccountDto } from './account.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>
    ) { }

    async getAllUsers(): Promise<Account[]> {
        return this.accountRepository.find();
    }

    async getUser(id: string) {
        return this.accountRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string) {
        return this.accountRepository.findOne({
            where: { email }
        });
    }

    async createUser(createDTO: CreateAccountDto): Promise<Account> {
        if (!createDTO.password || !createDTO.email) {
            throw new BadRequestException('Vui lòng nhập đủ thông tin');
        }

        if (createDTO.password.length < 6) {
            throw new BadRequestException('Mật khẩu phải có ít nhất 6 ký tự');
        }

        const existingUser = await this.accountRepository.findOne({
            where: { email: createDTO.email }
        });

        if (existingUser) {
            throw new BadRequestException('Email đã tồn tại');
        }

        const Hashpassword = await bcrypt.hash(createDTO.password, 10);

        const user = this.accountRepository.create({
            email: createDTO.email,
            password_hash: Hashpassword,
            role: createDTO.role,
        });
        return this.accountRepository.save(user);
    }

    async updateUser(id: string, updateDTO: UpdateAccountDto) {
        const user = await this.accountRepository.findOne({ where: { id } });

        if (!user) {
            throw new BadRequestException('Người dùng không tồn tại');
        }

        if (updateDTO.password) {
            if (updateDTO.password.length < 6) {
                throw new BadRequestException('Mật khẩu phải có ít nhất 6 ký tự');
            }
            user.password_hash = await bcrypt.hash(updateDTO.password, 10);
        }
        user.email = updateDTO.email;
        user.password_hash = await bcrypt.hash(updateDTO.password, 10);
        user.updatedAt = new Date();

        return this.accountRepository.save(user);
    }

    async deleteUser(id: string) {
        const user = await this.accountRepository.findOne({ where: { id } });

        if (!user) {
            throw new BadRequestException('Người dùng không tồn tại');
        }
        return this.accountRepository.softDelete(id);
    }
}

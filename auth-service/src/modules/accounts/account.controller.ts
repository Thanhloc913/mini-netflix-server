import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, UpdateAccountDto } from './account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerOrAdminGuard } from '../auth/owner-or-admin.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get()
    getAllUsers() {
        return this.accountService.getAllUsers();
    }

    @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
    @Get(':id')
    getUser(@Param('id') id: string) {
        return this.accountService.getUser(id);
    }

    @Post()
    createUser(@Body() createAccountDto: CreateAccountDto) {
        return this.accountService.createUser(createAccountDto);
    }

    @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
    @Put(':id')
    updateUser(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountService.updateUser(id, updateAccountDto);
    }

    @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.accountService.deleteUser(id);
    }
}
